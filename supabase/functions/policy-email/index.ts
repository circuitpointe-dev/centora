// supabase/functions/policy-email/index.ts
// Sends reminder/escalation emails for HR policy acknowledgments
// Requires env: RESEND_API_KEY, FROM_EMAIL

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type EmailAction = 'remind' | 'escalate'

interface Payload {
    org_id?: string
    policy_id: string
    action: EmailAction
    subject?: string
    message?: string
}

async function sendWithResend(to: string[], subject: string, html: string) {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL')
    if (!RESEND_API_KEY || !FROM_EMAIL) {
        console.warn('Email disabled: RESEND_API_KEY or FROM_EMAIL not set.')
        return { disabled: true }
    }
    const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        }),
    })
    if (!resp.ok) {
        const text = await resp.text()
        throw new Error(`Resend send failed: ${resp.status} ${text}`)
    }
    return await resp.json()
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const url = Deno.env.get('SUPABASE_URL')
        if (!serviceRoleKey || !url) {
            return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500, headers: corsHeaders })
        }
        const supabase = createClient(url, serviceRoleKey)

        const payload = (await req.json()) as Payload
        const { policy_id, action } = payload

        // Fetch policy
        const { data: policy, error: policyErr } = await supabase
            .from('hr_policies')
            .select('id, org_id, title')
            .eq('id', policy_id)
            .single()
        if (policyErr || !policy) throw policyErr || new Error('Policy not found')

        // Find recipients: employees with pending acknowledgments for this policy
        const { data: acks, error: ackErr } = await supabase
            .from('hr_policy_acknowledgments')
            .select('employee_id, status')
            .eq('policy_id', policy_id)
        if (ackErr) throw ackErr

        const employeeIds = (acks || [])
            .filter((a) => a.status !== 'acknowledged')
            .map((a) => a.employee_id)
            .filter(Boolean)

        if (employeeIds.length === 0) {
            return new Response(
                JSON.stringify({ success: true, sent: 0, message: 'No recipients to notify' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
        }

        // Join employees -> profiles for email
        const { data: employees, error: empErr } = await supabase
            .from('hr_employees')
            .select('id, email')
            .in('id', employeeIds as string[])
        if (empErr) throw empErr
        const recipients = (employees || [])
            .map((e) => e.email)
            .filter((e): e is string => !!e)

        if (recipients.length === 0) {
            return new Response(
                JSON.stringify({ success: true, sent: 0, message: 'No recipient emails found' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
        }

        const subject = payload.subject ||
            (action === 'remind' ? `Reminder: Please acknowledge ${policy.title}` : `Escalation: Pending acknowledgment for ${policy.title}`)
        const html = `
      <p>Hello,</p>
      <p>This is a ${action} for the policy <strong>${policy.title}</strong>. Please log in to Centora ERP to review and acknowledge.</p>
      <p>Thanks.</p>
    `

        const result = await sendWithResend(recipients, subject, html)

        // Stamp last_reminded_at for all pending rows on reminder
        if (action === 'remind') {
            await supabase
                .from('hr_policy_acknowledgments')
                .update({ last_reminded_at: new Date().toISOString() })
                .eq('policy_id', policy_id)
                .neq('status', 'acknowledged')
        }

        return new Response(
            JSON.stringify({ success: true, sent: recipients.length, result }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (e) {
        console.error('policy-email error', e)
        return new Response(JSON.stringify({ error: e?.message || 'Unexpected error' }), { status: 400, headers: corsHeaders })
    }
})

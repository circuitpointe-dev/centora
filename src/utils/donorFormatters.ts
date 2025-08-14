export const formatLastDonation = (donor: any) => {
  if (donor.lastDonationInfo) {
    const { amount, currency, donation_date } = donor.lastDonationInfo;
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
    
    const formattedDate = new Date(donation_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return `${formattedAmount} on ${formattedDate}`;
  }
  
  return 'No donations';
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
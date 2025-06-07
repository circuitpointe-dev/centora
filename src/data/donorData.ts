
import { Donor } from "@/types/donor";

export const donorsData: Donor[] = [
  {
    id: "1",
    name: "FCDO (Foreign, Commonwealth & Development Office)",
    contactInfo: {
      email: "info@fcdo.gov.uk",
      phone: "+44 20 7008 1500",
      address: "King Charles Street, London SW1A 2AH, UK"
    },
    lastDonation: "2024-02-15",
    interestTags: ["Education", "Health", "Infrastructure"],
    totalDonations: 2500000,
    status: "Active"
  },
  {
    id: "2",
    name: "UNICEF",
    contactInfo: {
      email: "partnerships@unicef.org",
      phone: "+1 212 326 7000",
      address: "3 United Nations Plaza, New York, NY 10017, USA"
    },
    lastDonation: "2024-01-20",
    interestTags: ["Child Health", "Education", "Emergency Response"],
    totalDonations: 1800000,
    status: "Active"
  },
  {
    id: "3",
    name: "Global Fund",
    contactInfo: {
      email: "info@theglobalfund.org",
      phone: "+41 58 791 1700",
      address: "Chemin de Blandonnet 8, 1214 Vernier, Switzerland"
    },
    lastDonation: "2023-11-30",
    interestTags: ["Health", "Disease Prevention", "Public Health"],
    totalDonations: 3200000,
    status: "Inactive"
  },
  {
    id: "4",
    name: "USAID",
    contactInfo: {
      email: "partnerships@usaid.gov",
      phone: "+1 202 712 0000",
      address: "1300 Pennsylvania Avenue, NW, Washington, DC 20523, USA"
    },
    lastDonation: "2024-03-10",
    interestTags: ["Infrastructure", "Economic Development", "Agriculture"],
    totalDonations: 4100000,
    status: "Active"
  },
  {
    id: "5",
    name: "World Health Organization (WHO)",
    contactInfo: {
      email: "partnerships@who.int",
      phone: "+41 22 791 21 11",
      address: "Avenue Appia 20, 1211 Geneva 27, Switzerland"
    },
    lastDonation: "2024-02-28",
    interestTags: ["Health", "Pandemic Response", "Medical Research"],
    totalDonations: 2800000,
    status: "Active"
  },
  {
    id: "6",
    name: "Gates Foundation",
    contactInfo: {
      email: "info@gatesfoundation.org",
      phone: "+1 206 709 3100",
      address: "440 5th Avenue North, Seattle, WA 98109, USA"
    },
    lastDonation: "2024-01-05",
    interestTags: ["Vaccine Distribution", "Health Innovation", "Education"],
    totalDonations: 5500000,
    status: "Active"
  },
  {
    id: "7",
    name: "European Commission",
    contactInfo: {
      email: "partnerships@ec.europa.eu",
      phone: "+32 2 299 11 11",
      address: "Rue de la Loi 200, 1049 Brussels, Belgium"
    },
    lastDonation: "2023-12-15",
    interestTags: ["Climate Action", "Social Development", "Technology"],
    totalDonations: 1200000,
    status: "Potential"
  },
  {
    id: "8",
    name: "World Bank",
    contactInfo: {
      email: "partnerships@worldbank.org",
      phone: "+1 202 473 1000",
      address: "1818 H Street NW, Washington, DC 20433, USA"
    },
    lastDonation: "2024-02-01",
    interestTags: ["Infrastructure", "Economic Development", "Education"],
    totalDonations: 3800000,
    status: "Active"
  }
];

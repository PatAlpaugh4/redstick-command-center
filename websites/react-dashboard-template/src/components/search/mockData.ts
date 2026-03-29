/**
 * Mock Search Data
 * ================
 * Sample searchable items for testing and demo purposes.
 * 15 items across different types: deals, companies, contacts, documents.
 */

import type { SearchableItem } from '@hooks/useGlobalSearch'

export const mockSearchableItems: SearchableItem[] = [
  // Deals (4 items)
  {
    id: 'deal-001',
    type: 'deal',
    title: 'Acme Corp Series A',
    subtitle: '$12M • Term Sheet Signed • SaaS',
    url: '/deals/acme-corp-series-a',
  },
  {
    id: 'deal-002',
    type: 'deal',
    title: 'TechStart Seed Round',
    subtitle: '$3M • Due Diligence • Fintech',
    url: '/deals/techstart-seed',
  },
  {
    id: 'deal-003',
    type: 'deal',
    title: 'GreenEnergy Series B',
    subtitle: '$25M • Pitch Review • CleanTech',
    url: '/deals/greenenergy-series-b',
  },
  {
    id: 'deal-004',
    type: 'deal',
    title: 'HealthPlus Pre-Seed',
    subtitle: '$800K • Initial Review • HealthTech',
    url: '/deals/healthplus-pre-seed',
  },

  // Companies (4 items)
  {
    id: 'company-001',
    type: 'company',
    title: 'Acme Corporation',
    subtitle: 'Enterprise SaaS • 120 employees • San Francisco, CA',
    url: '/companies/acme-corporation',
  },
  {
    id: 'company-002',
    type: 'company',
    title: 'TechStart Inc.',
    subtitle: 'Fintech Platform • 45 employees • New York, NY',
    url: '/companies/techstart-inc',
  },
  {
    id: 'company-003',
    type: 'company',
    title: 'GreenEnergy Solutions',
    subtitle: 'Renewable Energy • 200 employees • Austin, TX',
    url: '/companies/greenenergy-solutions',
  },
  {
    id: 'company-004',
    type: 'company',
    title: 'HealthPlus Medical',
    subtitle: 'Digital Health • 28 employees • Boston, MA',
    url: '/companies/healthplus-medical',
  },

  // Contacts (4 items)
  {
    id: 'contact-001',
    type: 'contact',
    title: 'John Smith',
    subtitle: 'CEO • Acme Corporation • john@acme.com',
    url: '/contacts/john-smith',
  },
  {
    id: 'contact-002',
    type: 'contact',
    title: 'Sarah Johnson',
    subtitle: 'CFO • TechStart Inc. • sarah@techstart.io',
    url: '/contacts/sarah-johnson',
  },
  {
    id: 'contact-003',
    type: 'contact',
    title: 'Michael Chen',
    subtitle: 'CTO • GreenEnergy Solutions • michael@greenenergy.com',
    url: '/contacts/michael-chen',
  },
  {
    id: 'contact-004',
    type: 'contact',
    title: 'Emily Davis',
    subtitle: 'Founder • HealthPlus Medical • emily@healthplus.io',
    url: '/contacts/emily-davis',
  },
  {
    id: 'contact-005',
    type: 'contact',
    title: 'David Wilson',
    subtitle: 'VP Engineering • Acme Corporation • david@acme.com',
    url: '/contacts/david-wilson',
  },

  // Documents (3 items)
  {
    id: 'doc-001',
    type: 'document',
    title: 'Acme Corp - Term Sheet',
    subtitle: 'PDF • 12 pages • Modified 2 days ago',
    url: '/documents/acme-corp-term-sheet',
  },
  {
    id: 'doc-002',
    type: 'document',
    title: 'TechStart Due Diligence Report',
    subtitle: 'PDF • 45 pages • Modified 1 week ago',
    url: '/documents/techstart-due-diligence',
  },
  {
    id: 'doc-003',
    type: 'document',
    title: 'GreenEnergy Financial Model',
    subtitle: 'Excel • Modified 3 days ago',
    url: '/documents/greenenergy-financial-model',
  },
  {
    id: 'doc-004',
    type: 'document',
    title: 'Portfolio Update Q4 2024',
    subtitle: 'PDF • 8 pages • Modified yesterday',
    url: '/documents/portfolio-update-q4-2024',
  },
]

export default mockSearchableItems

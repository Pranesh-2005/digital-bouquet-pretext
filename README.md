# 🌸 DigiBouquet

> Beautiful flowers delivered digitally

DigiBouquet allows users to create personalized digital flower bouquets with meaningful messages. Choose from a curated selection of flowers, each with their own symbolic meanings and birth month associations, to create beautiful bouquets that can be shared digitally.

## ✨ Features

- **🌺 Flower Selection**: Choose from 12 different flowers, each with unique meanings:

  - 🌹 Rose (Love and passion) - June
  - 🌷 Tulip (Perfect love) - April
  - 🌸 Peony (Romance) - May
  - 🌻 Sunflower (Adoration) - August
  - 🌺 Orchid (Beauty) - October
  - 💐 Dahlia (Elegance) - August
  - 🌼 Daisy (Innocence) - April
  - 🌾 Lily (Purity) - May
  - 🌟 Anemone (Anticipation) - September
  - 🌿 Carnation (Fascination) - January
  - ⭐ Zinnia (Lasting Affection) - July
  - 🎪 Ranunculus (Radiant Charm) - March

- **📝 Personal Messages**: Add custom cards with sender, recipient, and personalized messages

- **🏡 Garden View**: Browse previously created bouquets
- **🔗 Shareable Links**: Each bouquet gets a unique URL for easy sharing

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **UI Components**: Shadcn UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd digibouquet
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
digibouquet/
├── app/                      # Next.js App Router pages
│   ├── bouquet/             # Bouquet creation and viewing
│   ├── garden/              # Garden view page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── bouquet/            # Bouquet display components
│   ├── stages/             # Creation flow stages
│   └── ui/                 # Reusable UI components
├── context/                # React Context providers
├── data/                   # Static data (flowers, meanings)
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
│   ├── color/              # Color flower images
│   ├── mono/               # Black & white images
│   └── full/               # Full resolution images
└── styles/                 # Global styles
```

---

_Create meaningful digital bouquets that bloom forever_ 🌺
# digi-flower

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Author } from "../types";
import { geographies } from "./storyTemplates";

const firstNames = [
  "Marcus",
  "Aisha",
  "Elena",
  "Devon",
  "Priya",
  "Samir",
  "Nora",
  "Julian",
  "Mei",
  "Amara",
  "Theo",
  "Leila",
  "Mateo",
  "Iris",
  "Owen",
  "Rina",
  "Jonas",
  "Anika",
  "Caleb",
  "Sofia",
];

const lastNames = [
  "Chen",
  "Khan",
  "Marquez",
  "Brooks",
  "Raman",
  "Okafor",
  "Iversen",
  "Patel",
  "Tan",
  "Mensah",
  "Weber",
  "Singh",
  "Silva",
  "Morgan",
  "Haddad",
  "Nakamura",
  "Kowalski",
  "Rivera",
  "Shah",
  "Bennett",
];

const companies = [
  "Nimbus",
  "PixelFlow",
  "HyperCart",
  "Cedar Labs",
  "LoopForge",
  "Northstar",
  "Veloce",
  "LatticeOps",
  "GreenGrid",
  "RelayWorks",
  "BrightFarm",
  "SignalNest",
  "Koru Health",
  "ForgePath",
  "Tandem Bio",
  "OrbitPay",
  "ClassArc",
  "Vaultline",
  "Mira Robotics",
  "Draftwell",
];

const roles = [
  "Founder",
  "CEO",
  "CTO",
  "Product Lead",
  "Co-founder",
  "Head of Growth",
  "Design Partner",
  "VP Engineering",
];

const avatarIds = [
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1494790108377-be9c29b29330",
  "photo-1500648767791-00dcc994a43e",
  "photo-1534528741775-53994a69daeb",
  "photo-1519345182560-3f2917c472ef",
  "photo-1527980965255-d3b416303d12",
  "photo-1544005313-94ddf0286df2",
  "photo-1547425260-76bcadfb4f2c",
];

export function generateAuthor(index: number, industry: string): Author {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / 2) % lastNames.length];
  const company = companies[(index * 7) % companies.length];
  const role = roles[(index * 5) % roles.length];
  const location = geographies[(index * 3) % geographies.length];
  const followerBase = 420 + ((index * 811) % 18500);

  return {
    id: `author-${index}`,
    name: `${firstName} ${lastName}`,
    avatar: `https://images.unsplash.com/${avatarIds[index % avatarIds.length]}?auto=format&fit=crop&w=150&q=80`,
    headline: `${role} • ${company}`,
    company,
    industry,
    isVerified: index % 4 !== 1,
    location,
    website: `https://${company.toLowerCase().replace(/\s+/g, "")}.example.com`,
    linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    bio: `${role} building in ${industry} from ${location}. Shares practical notes from decisions that were messier than the pitch deck.`,
    followers: followerBase,
    following: 80 + ((index * 37) % 900),
    storiesPublished: 1 + (index % 11),
    lessonsShared: 3 + (index % 17),
    bookmarksCount: 6 + ((index * 13) % 140),
    readingStreak: 1 + (index % 24),
    totalReads: followerBase * (3 + (index % 9)),
    aiScore: 78 + (index % 20),
  };
}

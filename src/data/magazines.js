export const magazines = [
  {
    id: 6,
    _id: '6', // Matches useParams().id as a string
    title: 'Issue 06 — The Future',
    issue: '06',
    cover: 'assets/magazines/1.jpg',
    featuredImage: 'assets/magazines/1.jpg', // Map to featuredImage for CoverCard compatibility
    link: '/magazines/issue-06',
    publishedAt: '2025-06-01',
    createdAt: '2025-06-01T00:00:00.000Z', // Map to createdAt for filtering/sorting
    totalPages: 3,
    pages: [
      {
        _id: '6_p1',
        pageOrder: 1,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/1.jpg', // Uses the cover as page 1
          hasFeaturedImage: true,
        }
      },
      {
        _id: '6_p2',
        pageOrder: 2,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/1.jpg', // Mock page 2
          hasFeaturedImage: true,
        }
      },
      {
        _id: '6_p3',
        pageOrder: 3,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/1.jpg', // Mock page 3
          hasFeaturedImage: true,
        }
      }
    ]
  },
  {
    id: 5,
    _id: '5',
    title: 'Issue 05 — Writing the Script',
    issue: '05',
    cover: 'assets/magazines/2.jpg',
    featuredImage: 'assets/magazines/2.jpg',
    link: '/magazines/issue-05',
    publishedAt: '2025-05-01',
    createdAt: '2025-05-01T00:00:00.000Z',
    totalPages: 3,
    pages: [
      {
        _id: '5_p1',
        pageOrder: 1,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/2.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '5_p2',
        pageOrder: 2,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/background/1.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '5_p3',
        pageOrder: 3,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/3.jpg',
          hasFeaturedImage: true,
        }
      }
    ]
  },
  {
    id: 4,
    _id: '4',
    title: 'Issue 04 — Voices & Stories',
    issue: '04',
    cover: 'assets/magazines/3.jpg',
    featuredImage: 'assets/magazines/3.jpg',
    link: '/magazines/issue-04',
    publishedAt: '2025-04-01',
    createdAt: '2025-04-01T00:00:00.000Z',
    totalPages: 3,
    pages: [
      {
        _id: '4_p1',
        pageOrder: 1,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/3.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '4_p2',
        pageOrder: 2,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/background/1.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '4_p3',
        pageOrder: 3,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/4.jpg',
          hasFeaturedImage: true,
        }
      }
    ]
  },
  {
    id: 3,
    _id: '3',
    title: 'Issue 03 — The Creative Process',
    issue: '03',
    cover: 'assets/magazines/4.jpg',
    featuredImage: 'assets/magazines/4.jpg',
    link: '/magazines/issue-03',
    publishedAt: '2025-03-01',
    createdAt: '2025-03-01T00:00:00.000Z',
    totalPages: 3,
    pages: [
      {
        _id: '3_p1',
        pageOrder: 1,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/4.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '3_p2',
        pageOrder: 2,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/background/1.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '3_p3',
        pageOrder: 3,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/5.jpg',
          hasFeaturedImage: true,
        }
      }
    ]
  },
  {
    id: 2,
    _id: '2',
    title: 'Issue 02 — Inspiration & Ideas',
    issue: '02',
    cover: 'assets/magazines/5.jpg',
    featuredImage: 'assets/magazines/5.jpg',
    link: '/magazines/issue-02',
    publishedAt: '2026-02-01',
    createdAt: '2026-02-01T00:00:00.000Z',
    totalPages: 2,
    pages: [
      {
        _id: '2_p1',
        pageOrder: 1,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/magazines/5.jpg',
          hasFeaturedImage: true,
        }
      },
      {
        _id: '2_p2',
        pageOrder: 2,
        archetype: 'image',
        content: {
          featuredImageUrl: '/assets/background/1.jpg',
          hasFeaturedImage: true,
        }
      }
    ]
  },
];
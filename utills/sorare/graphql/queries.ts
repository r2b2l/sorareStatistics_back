export const QALLCARDSFROMUSER = `
query AllCardsFromUser($slug: String!, $cursor: String) {
  user(slug: $slug) {
    paginatedCards(after: $cursor) {
      nodes {
        slug
        pictureUrl
        power
        rarity
        player {
          displayName
        }
        ownerWithRates {
          from
          price
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
}
`;

export const QSINGLECARD = `
query SingleCard($slugs: [String!]) {
  cards(slugs: $slugs) {
    assetId
    slug
    age
    positionTyped
    team{
      ... on Club {
        name
      }
    }
    player {
      id
      displayName
      slug
    }
  }
}
`;

// Ne fonctionne pas
export const FSIMPLEPLAYERINFOS = `
fragment PlayerParts on Card {
  displayName
}
`;
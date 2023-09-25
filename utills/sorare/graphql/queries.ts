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
          slug
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
      pictureUrl
      slug
    }
  }
}
`;

export const QPLAYERINFOS = `
query PlayerInfos($slug: String!) {
  football {
    player(slug: $slug) {
      id
      slug
      age
      country {
        slug
        flagUrl
      }
      displayName
      position
      pictureUrl
      activeClub {
        slug
      }
      lastFiveSo5Appearances
      lastFifteenSo5Appearances
      allSo5Scores {
        nodes{
          game {
            date
          }
          score
        }
      }
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
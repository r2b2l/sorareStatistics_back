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
        id
        slug
        flagUrl
      }
      displayName
      position
      pictureUrl
      activeClub {
        slug
        name
        pictureUrl
        pictureSecondaryUrl
        country {
          id
          slug
          flagUrl
        }
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

export const QCLUBINFOS = `
query ClubInfos($slug: String!) {
  football {
    club(slug: $slug) {
      id
      slug
      name
      shortName
      pictureUrl
      country {
        id
        slug
        flagUrl
      }
      activeCompetitions {
        name
      }
      domesticLeague {
        displayName
        logoUrl
      }
      upcomingGames(first: 10) {
        date
        competition {
          displayName
        }
        homeTeam {
          ... on Club {
            slug
            name
            pictureUrl
          }
        }
        awayTeam {
          ... on Club {
            slug
            name
            pictureUrl
          }
        }
      }
    }
  }
}
`;

export const QPLAYERSBYCLUB = `
query PlayersByClubSlug($slug: String!) {
  football {
    club(slug: $slug) {
      id
      slug
      activePlayers{
        nodes{
          id
          slug
          displayName
          lastFiveSo5Appearances
          lastFifteenSo5Appearances
          pictureUrl
          position
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
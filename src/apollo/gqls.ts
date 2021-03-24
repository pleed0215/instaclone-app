import gql from "graphql-tag";
import { PART_PHOTO } from "./fragments";

export const GQL_SEE_FEEDS = gql`
    query QuerySeeFeeds($input: SeeFeedsInput!) {
        seeFeeds(input: $input) {
            ok
            error
            feeds {
                ...PartPhoto
            }
        }
        ${PART_PHOTO}
    }
`;

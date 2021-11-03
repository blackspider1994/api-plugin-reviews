import pkg from "../package.json";
import importAsString from "@reactioncommerce/api-utils/importAsString.js";
import resolvers from "./resolver/resolvers.js";
import _ from "lodash";

const mySchema = importAsString("./schema.graphql");

var _context = null;

function reviewsStartUp(context) {
  _context = context;
  const { app, collections, rootUrl, db } = context;
}

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "product-reviews",
    name: "product-reviews",
    version: pkg.version,
    collections: {
      Reviews: {
        name: "Reviews",
        updatedAt: { type: Date, default: Date.now } ,
        indexes: [
          // Create indexes. We set specific names for backwards compatibility
          // with indexes created by the aldeed:schema-index Meteor package.
          [{ productId: 1 }, { name: "c2_productId" }],
          [{ accountId: 1 }, { name: "c2_accountId" }],
          [{ createdAt: 1 }, { name: "c2_createdAt" }],
          [{ updatedAt: 1, _id: 1 }],
        ],
      },
    },
    functionsByType: {
      startup: [reviewsStartUp],
    },
    graphQL: {
      schemas: [mySchema],
      resolvers,
    },
  });
}

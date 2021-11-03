import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";

/**
 * @name getProductReview
 * @method
 * @memberof Catalog/NoMeteorQueries
 * @summary query the Catalog by shop ID and/or tag ID
 * @param {Object} context - an object containing the per-request state
 * @param {Object} params - request parameters
 * @param {String[]} [params.searchQuery] - Optional text search query
 * @param {String[]} [params.shopIds] - Shop IDs to include (OR)
 * @param {String[]} [params.tags] - Tag IDs to include (OR)
 * @returns {Promise<MongoCursor>} - A MongoDB cursor for the proper query
 */
export default async function getProductReview(context, { productId,sortOrder }) {
  const { collections } = context;
  const { Reviews } = collections;

  if ((!productId || productId.length === 0)
  //  && (!tagIds || tagIds.length === 0)
   ) {
    throw new ReactionError(
      "invalid-param",
      "You must provide productId "
    );
  }
  let decodeProductId = decodeOpaqueId(productId).id;
  if (decodeProductId == productId||productId.length==0) {
    throw new Error("ProductId must be a Reaction ID");
  }
  const query = {
    "productId": decodeProductId,
  };
  const orderBy={
    updatedAt:sortOrder=='asc'?1:-1
  }
  return Reviews.find(query).sort(orderBy).toArray();
}

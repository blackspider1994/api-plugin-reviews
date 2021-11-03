import generateUID from "./generateUID.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";

/**
 *
 * @method updateProductReview
 * @summary Add or update product reviews by users
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @returns {Promise<Object[]>} Array of product reviews objects.
 */
export default async function updateProductReview(
  context,
  args,
  accountId
 
) {
  const { collections } = context;
  const { Reviews } = collections;
  const {reviewId,productId,review,score}=args;
  if ((!productId || productId.length === 0)
  //  && (!tagIds || tagIds.length === 0)
   ) {
    throw new Error(
      "invalid-param",
      "You must provide productId "
    );
  }
  if(reviewId&&reviewId.trim().length>0){
    let insert_obj={
      review:review,
      score:score,
      updatedAt:new Date()
    }
    let reviewupdated=await Reviews.findOneAndUpdate({"_id":reviewId},{"$set": insert_obj});
    return reviewupdated.value;
  }else{
    let new_id=await generateUID();
    let decodeProductId=decodeOpaqueId(productId).id;
    if (decodeProductId == productId||productId.length==0) {
      throw new Error("ProductId must be a Reaction ID");
    }
    let insert_obj={
      _id:new_id,
      review:review,
      score:score,
      productId:decodeOpaqueId(productId).id,
      createdBy:accountId,
      createdAt:new Date(),
      updatedAt:new Date()
    }
    let reviewAdded=await Reviews.insertOne(insert_obj);
     if(reviewAdded.insertedId){
      return Reviews.findOne({"_id":reviewAdded.insertedId});
     }
     else{
       throw new Error("Something went wrong")
     }

  }
  
  
}

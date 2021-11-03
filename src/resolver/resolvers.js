import updateProductReview from "../utils/updateProductReview.js";
import getProductReview from "../utils/getProductReview.js";
import accountByUserId from "../utils/accountByUserId.js"
const resolvers = {
  productReview:{
    async createdBy(parent,args,context,info){
      let userInfo=await accountByUserId(context,parent.createdBy);
      return { name: userInfo.name
        ? userInfo.name
        : userInfo.profile.name
        ? userInfo.profile.name
        : userInfo.username
        ? userInfo.username
        : userInfo.profile.username
        ? userInfo.profile.username
        : "Anonymous",
      Image: userInfo.profile.picture
      }
    }
  },
  Query: {
   async productReviews(parent,args,context,info){
        console.log("productReviews query",args)
        let query_response=await getProductReview(context,args);
        return query_response;

    }
  },
  Mutation: {
    
    async createOrUpdateProductReview(parent,args,context,info){
        let accountId=context.userId;
        if(!accountId||accountId==null){
            console.log("Unauthenticated user");
            throw new Error("Unauthenticated user");
        }
        let mutation_response=await updateProductReview(context,args.input,accountId);
        return mutation_response;


    }
  },
};
export default resolvers;

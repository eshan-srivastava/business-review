// TODO: re-use the comparator function as they are the same in business_by_search_term and business_reviews

export const resolvers = {
    Query: {
        businessBySearchTerm: (_, args, contextValue) => {
            // comparator function that compares two strings a and b
            //standard JS comparator return asc form: -1 if a<b, 0 if equal, 1 if a>b (for desc reverse -1 and 1)
            const compare = (a, b) => {
                //the orderBy property specifies two variables orderField and order: field to order WRT and desc/asc
                const [orderField, order] = args.orderBy.split("_");
                const left = a[orderField], right = b[orderField];

                if (left < right){
                    return order === "asc" ? -1 : 1;
                }
                else if (left > right) {
                    return order === "desc" ? -1 : 1;
                }
                else{
                    return 0;
                }
            };

            //offset and first from args to do pagination
            return contextValue.db.businesses.filter(v => {
                return v["name"].indexOf(args.search) !== -1;
            }).slice(args.offset, args.first).sort(compare);
        },
        allBusinesses: (_, args, contextValue) => {
            return contextValue.db.businesses;
        },
        userById: (_, args, contextValue) => {
            return contextValue.db.users.filter(v => {
                return v.userId === args.id;
            })[0];
        },
        categories: (_, args, contextValue) => {
            return contextValue.db.categories;
        },
    },
    //a Business's resolver has to deal with reviews and avgstars separately
    //as reviews is a recursive field and avgstars uses multiple
    Business: {
        waitTime: (obj, args, contextValue) => {
            const options = [0,5,10,15,30,45];
            return options[Math.floor(Math.random() * options.length)];
        },
        reviews: (obj, args, contextValue) => {
            //default order by star value is descending
            const compare = (a, b) => {
                //the orderBy property specifies two variables orderField and order: field to order WRT and desc/asc
                const [orderField, order] = args.orderBy.split("_");
                const left = a[orderField], right = b[orderField];

                if (left < right){
                    return order === "asc" ? -1 : 1;
                }
                else if (left > right) {
                    return order === "desc" ? -1 : 1;
                }
                else{
                    return 0;
                }
            };
            
            return obj.reviewIds.map(v => {
                return contextValue.db.reviews.find(review => {
                    return review.reviewId === v;
                })
            }).sort(compare);
        },
        avgStars: (obj, _, contextValue) => {
            const reviews = obj.reviewIds.map(v => {
                return contextValue.db.reviews.find(review => {
                    return review.reviewId === v;
                });
            });

            return (reviews.reduce((acc, review) => {
                return acc + review.stars;
            }, 0) / reviews.length 
            );
        },
    },
    //for a review the recursive fields are user and business to which it belongs
    Review: {
        user: (obj, _, contextValue) => {
            return contextValue.db.users.find(user => {
                return user.userId === obj.userId;
            });
        },
        business: (obj, _, contextValue) => {
            return contextValue.db.businesses.find((b) => {
                return b.businessId === obj.businessId;
            });
        }
    },
    //for a user the recursive fields is reviews associated
    User: {
        reviews: (obj, _, contextValue) => {
            return obj.reviewIds.map((r) => {
                return contextValue.db.reviews.find((review) => {
                    return review.reviewId === r;
                });
            });
        },
    },
    Category: {
        businesses: (obj, _, contextValue) => {
            return contextValue.db.businesses.filter( v => {
                return v.categories.includes(obj.name);
            });
        }
    }
};
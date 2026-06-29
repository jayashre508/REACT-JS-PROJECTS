import { Client, Databases, ID, Query } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


// let's get appwrite functionalities
const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')  //just like how we set up our movie API's
.setProject(PROJECT_ID)

const database = new Databases(client);

//let's implement this function which tracks the searches made by different users, this function take in 2 parameters seachTerm --> that user had searched for , movie --> associated with the search term
export const updateSearchCount = async (searchTerm, movie) => {
// this function has to do the following things
//1. use APpwrite SDK to check if the search term exists in the databases
try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)

    ])
//2. if it does , update the count
    if(result.documents.length>0){
const doc = result.documents[0];

await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,  {
    count: doc.count + 1,
})
// 3. If it doesn't, create a new document with the search term and count as 1
    } else {
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm,
    count: 1,
    movie_id: movie.id,
    poster_URL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
   })
  }
} catch (error) {
    console.error(error);
}



}

export const getTrendingMovies = async () => {
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(5),
    Query.orderDesc("count")
  ])

  return result.documents;
 } catch (error) {
  console.error(error);
 }
}

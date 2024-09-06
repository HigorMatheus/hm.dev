import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: "https://api-us-west-2.hygraph.com/v2/cl4r00c7g0f4m01wb17yv0fby/master",
	cache: new InMemoryCache(),
});

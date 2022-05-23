import {
  booleanArg,
  extendType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";

export const Post = objectType({
  name: "Post", // <- Name of your type
  definition(t) {
    t.int("id"); // <- Field named `id` of type `Int`
    t.string("title"); // <- Field named `title` of type `String`
    t.string("body"); // <- Field named `body` of type `String`
    t.boolean("published"); // <- Field named `published` of type `Boolean`
  },
});

// query
export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_, __, { db }) {
        // logic
        return db.post.findMany();
      },
    }),
		t.nonNull.field("post", {
			type: "Post",
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (_, { id }, { db }) => {
				// logic
				return db.post.findUnique({
					where: { id },
				});
			},
		});
  },
});

// mutation
export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        id: intArg(),
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
        published: booleanArg(),
      },
      resolve(_root, { title, body, published }, { db }) {
        return db.post.create({
          data: {
            title,
            body,
            published: published ?? false,
          },
        });
      },
    });
  },
});

const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLDate = require('graphql-date');
const Books = require('../models/Books');



const bookType = new GraphQLObjectType({
  name: 'Books',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      isbn: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      published_year: {
        type: GraphQLInt
      },
      publisher: {
        type: GraphQLString
      },
      updated_date: {
        type: GraphQLDate
      }
    }
  }
})


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      books: {
        type: new GraphQLList(bookType),
        resolve: function () {
          const books = Books.find().exec();
          if (!books) {
            throw new Error('Error')
          }
          return books;
        }
      },
      book: {
        type: bookType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const bookDetails = Books.findById(params.id).exec();
          if (!bookDetails) {
            throw new Error('Erro')
          }
          return bookDetails;
        }
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addBook: {
        type: bookType,
        args: {
          isbn: {
            type: GraphQLNonNull(GraphQLString)
          },
          title: {
            type: GraphQLNonNull(GraphQLString)
          },
          author: {
            type: GraphQLNonNull(GraphQLString)
          },
          description: {
            type: GraphQLNonNull(GraphQLString)
          },
          published_year: {
            type: GraphQLNonNull(GraphQLInt)
          },
          publisher: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {

          console.log(params);
          const bookModel = new Books(params);
          const newBook = bookModel.save();
          if (!newBook) {
            throw new Error('Error');
          }
          return newBook
        }
      },
      updateBook: {
        type: bookType,
        args: {
          id: {
            name: 'id',
            type: GraphQLNonNull(GraphQLString)
          },
          isbn: {
            type: GraphQLNonNull(GraphQLString)
          },
          title: {
            type: GraphQLNonNull(GraphQLString)
          },
          author: {
            type: GraphQLNonNull(GraphQLString)
          },
          description: {
            type: GraphQLNonNull(GraphQLString)
          },
          published_year: {
            type: GraphQLNonNull(GraphQLInt)
          },
          publisher: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          // params.updated_date = Date;
          return Books.findOneAndUpdate({
            _id: params.id
          }, {
            isbn: params.isbn,
            title: params.title,
            author: params.author,
            description: params.description,
            published_year: params.published_year,
            publisher: params.publisher,
            updated_date: new Date()
          }, function (err) {
            if (err) return next(err);
          });
        }
      },
      deleteBook: {
        type: bookType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const removeBook = Books.findByIdAndRemove(params.id).exec();
          if (!removeBook) {
            throw new Error('Erro')
          }
          return removeBook;
        }
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
});
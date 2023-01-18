import fastify from 'fastify'
import { FromSchema } from "json-schema-to-ts";
import { Static, Type } from '@sinclair/typebox'

const server = fastify()

// https://www.fastify.io/docs/latest/Reference/TypeScript/

// --- type1

const todo = {
  type: 'object',
  properties: {
    mail: { type: 'string' },
    testInt: {type: "number", minimum: 5}
  },
  required: ['mail'],
} as const; // don't forget to use const !

server.post<{ Body: FromSchema<typeof todo> }>(
  '/todo',
  {
    schema: {
      body: todo,
      response: {
        201: {
          type: 'string',
        },
      },
    }
  },
  async (req, reply): Promise<void> => {

    console.log(req.body.mail)
    console.log(req.body.testInt)
    console.log(req.query)
    console.log(req.headers)

    reply.status(201).send("resABC!!!");
  },
);

server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})



// => npm i pg @fastify/postgres
// fastify.register(require('@fastify/postgres'), {
//   connectionString: 'postgres://postgres@localhost/postgres'
// })

// fastify.get('/user/:id', function (req, reply) {
//   fastify.pg.query(
//     'SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id],
//     function onResult (err, result) {
//       reply.send(err || result)
//     }
//   )
// })
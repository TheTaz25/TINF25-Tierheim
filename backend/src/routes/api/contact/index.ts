import { type FastifyPluginAsync } from "fastify";
import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "typebox";

const CreateContactBody = Type.Object({
  visitor: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  animalToVisit: Type.Number(),
  day: Type.String(),
  time: Type.String(),
});

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const typedFastify = fastify.withTypeProvider<TypeBoxTypeProvider>();

  typedFastify.post(
    "/",
    {
      schema: {
        body: CreateContactBody,
      },
    },
    async (request, reply) => {
      const prepared = fastify.db.prepare("INSERT INTO appointments (visitor, email, phone, animal, date) VALUES (?, ?, ?, ?, ?)")
      prepared.run('')
      return reply.send(request.body);
    },
  );
};

export default example;

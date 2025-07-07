-- CreateEnum
CREATE TYPE "TipoLista" AS ENUM ('favoritos', 'para_ler', 'avaliados');

-- CreateTable
CREATE TABLE "Resenha" (
    "id_resenha" SERIAL NOT NULL,
    "uid_firebase" TEXT NOT NULL,
    "id_livro" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "Resenha_pkey" PRIMARY KEY ("id_resenha")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id_comentario" SERIAL NOT NULL,
    "id_resenha" INTEGER NOT NULL,
    "uid_firebase" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "id_resposta" INTEGER,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "ListaLivros" (
    "id_lista" SERIAL NOT NULL,
    "uid_firebase" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "tipo_lista" "TipoLista" NOT NULL,

    CONSTRAINT "ListaLivros_pkey" PRIMARY KEY ("id_lista")
);

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_resposta_fkey" FOREIGN KEY ("id_resposta") REFERENCES "Comentario"("id_comentario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_resenha_fkey" FOREIGN KEY ("id_resenha") REFERENCES "Resenha"("id_resenha") ON DELETE RESTRICT ON UPDATE CASCADE;

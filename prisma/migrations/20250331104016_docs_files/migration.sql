-- CreateTable
CREATE TABLE "Doc" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL DEFAULT generate_short_id(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "text" TEXT,
    "fileId" TEXT,

    CONSTRAINT "Doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL DEFAULT generate_short_id(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "data" BYTEA NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doc_ref_key" ON "Doc"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "Doc_fileId_key" ON "Doc"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "File_ref_key" ON "File"("ref");

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

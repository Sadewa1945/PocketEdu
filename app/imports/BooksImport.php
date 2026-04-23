<?php

namespace App\Imports;

use App\Models\Book;
use App\Models\Bookshelf;
use App\Models\Genre;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BooksImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // 1. Logika untuk Bookshelf (Cari atau Buat Baru)
        $bookshelf = Bookshelf::firstOrCreate([
            'name' => $row['bookshelf'] // Nama kolom di Excel harus 'bookshelf'
        ]);

        // 2. Simpan Data Buku
        $book = Book::create([
            'bookshelf_id'   => $bookshelf->id,
            'title'          => $row['title'],
            'author'         => $row['author'],
            'isbn'           => $row['isbn'],
            'published_date' => $row['published_date'],
            'book_price'     => $row['book_price'],
            'publisher'      => $row['publisher'],
            'description'    => $row['description'] ?? null,
            'stock'          => $row['stock'] ?? 0,
        ]);

        // 3. Logika untuk Genre (Multi-genre pisah koma)
        if (!empty($row['genres'])) {
            $genreNames = explode(',', $row['genres']);
            $genreIds = [];

            foreach ($genreNames as $name) {
                $trimmedName = trim($name);
                $genre = Genre::firstOrCreate(
                    ['name' => $trimmedName],
                    ['slug' => Str::slug($trimmedName)] // Slug wajib karena migration unik
                );
                $genreIds[] = $genre->id;
            }

            // Pasangkan ke tabel pivot
            $book->genres()->sync($genreIds);
        }

        return $book;
    }
}
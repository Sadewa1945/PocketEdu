<?php

namespace App\Imports;

use App\Models\Book;
use App\Models\Bookshelf;
use App\Models\Genre;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class BooksImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $bookshelf = Bookshelf::firstOrCreate([
            'name' => $row['bookshelf'] 
        ]);

        $book = Book::create([
            'bookshelf_id'   => $bookshelf->id,
            'title'          => $row['title'],
            'author'         => $row['author'],
            'isbn'           => $row['isbn'],
            'published_date' => isset($row['published_date']) 
                                ? Date::excelToDateTimeObject($row['published_date'])->format('Y-m-d') 
                                : null,
            'book_price'     => $row['book_price'],
            'publisher'      => $row['publisher'],
            'description'    => $row['description'] ?? null,
            'stock'          => $row['stock'] ?? 0,
        ]);

        if (!empty($row['genres'])) {
            $genreNames = explode(',', $row['genres']);
            $genreIds = [];

            foreach ($genreNames as $name) {
                $trimmedName = trim($name);
                $genre = Genre::firstOrCreate(
                    ['name' => $trimmedName],
                    ['slug' => Str::slug($trimmedName)]
                );
                $genreIds[] = $genre->id;
            }

            $book->genres()->sync($genreIds);
        }

        return $book;
    }
}
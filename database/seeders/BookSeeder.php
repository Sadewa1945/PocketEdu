<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Stock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $book = Book::create([
            'title' => 'Alternate',
            'author' => 'Shigeaki Kato',
            'publisher' => 'Haru',
            'published_date' => '2023-06-01',
            'isbn' => '978-602-7740-28-7',
            'description' => 'Alternate adalah sebuah aplikasi khusus untuk murid SMA yang akan menghubungkan murid-murid SMA se-Jepang.
                                Berlatar SMA Kolese Enmei, Tokyo, hidup tiga orang murid SMA akan saling berpapasan.
                                Iruru, ketua klub memasak SMA Kolese Enmei, memiliki trauma yang membuatnya sukar berkomunikasi dengan orang lain, tetapi ingin membuktikan diri lewat kompetisi memasak.
                                Nazu membenci hubungan dalam keluarganya, karena itu, ia begitu percaya pada data dan bertekad menemukan pasangan paling serasi yang telah disaring dan dibuktikan dengan kecanggihan Alternate.
                                Sementara itu, Naoshi yang berhenti sekolah, nekat jauh-jauh pergi ke Tokyo dari Osaka untuk menemui teman band masa kecilnya.',
            'category_id' => 1,
        ]);

        Stock::create([
            'book_id' => $book->id,
            'total_stock' => 10,
            'available_stock' => 10,
            'status' => 'available',
        ]);
    }
}

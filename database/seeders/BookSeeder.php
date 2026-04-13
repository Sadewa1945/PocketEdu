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
        $books = [
            [
                'title' => 'Alternate',
                'author' => 'Shigeaki Kato',
                'publisher' => 'Haru',
                'published_date' => '2023-06-05',
                'isbn' => '9786235467115',
                'description' => 'Alternate adalah sebuah aplikasi khusus untuk murid SMA yang akan menghubungkan murid-murid SMA se-Jepang.
                                Berlatar SMA Kolese Enmei, Tokyo, hidup tiga orang murid SMA akan saling berpapasan.
                                Iruru, ketua klub memasak SMA Kolese Enmei, memiliki trauma yang membuatnya sukar berkomunikasi dengan orang lain, tetapi ingin membuktikan diri lewat kompetisi memasak.
                                Nazu membenci hubungan dalam keluarganya, karena itu, ia begitu percaya pada data dan bertekad menemukan pasangan paling serasi yang telah disaring dan dibuktikan dengan kecanggihan Alternate.
                                Sementara itu, Naoshi yang berhenti sekolah, nekat jauh-jauh pergi ke Tokyo dari Osaka untuk menemui teman band masa kecilnya.',
                'category_id' => 1,
                'total_stock' => 10,
                'available_stock' => 10
            ],
            [
                'title' => 'Your Name',
                'author' => 'Makoto Shinkai',
                'publisher' => 'Haru',
                'published_date' => '2020-02-20',
                'isbn' => '9786237351207',
                'description' => 'Mitsuha, seorang gadis SMA yang tinggal di sebuah desa di pegunungan, bermimpi dia menjadi seorang anak laki-laki. Dia bangun di sebuah kamar yang asing, berteman dengan orang asing, melihat kota Tokyo tepat di depan matanya. Di lain pihak, Taki, seorang pemuda SMA yang tinggal di Tokyo, juga bermimpi dirinya menjadi seorang gadis SMA yang tinggal di sebuah desa yang dikelilingi pegunungan. Akhirnya, keduanya pun sadar bahwa mereka bertukar tubuh dalam mimpi masing-masing. Takdir yang mempertemukan mereka itu mulai menggerakkan roda-roda nasib.',
                'category_id' => 1,
                'total_stock' => 5,
                'available_stock' => 5
            ],
            [
                'title' => 'Everything Becomes F: The Perfect Insider',
                'author' => 'Mori Hiroshi',
                'publisher' => 'Haru',
                'published_date' => '2025-07-27',
                'isbn' => '9786235467351',
                'description' => 'Sejak kecil, Profesor Magata Shiki hidup terisolasi di ruangannya di sebuah pusat riset berteknologi tinggi. Namun, pada suatu malam, ruangan yang seharusnya selalu terkunci rapat bak penjara itu tiba-tiba terbuka. Dari dalamnya, sebuah mayat bergaun pengantin muncul, menggelinding di atas robot-dengan tangan dan kaki yang termutilasi. Kebetulan, Saikawa Sohei-seorang dosen jurusan arsitektur-dan Nishinosono Moe, mahasiswinya, sedang mengunjungi pulau tersebut. Kini, mereka berdua harus memecahkan misteri pembunuhan ruang tertutup yang tampak mustahil ini.',
                'category_id' => 1,
                'total_stock' => 10,
                'available_stock' => 10
            ],
            [
                'title' => 'Weathering With You',
                'author' => 'Makoto Shinkai',
                'publisher' => 'Haru',
                'published_date' => '2021-02-22',
                'isbn' => '9786237351627',
                'description' => 'Pada suatu hari di musim panas, Hodaka, seorang siswa SMA kelas satu berhasil kabur dari pulau tempat tinggalnya dan pergi ke Tokyo. Suatu saat, di tengah derasnya hujan yang berkepanjangan dan dalam hiruk pikuk kota tersebut, Hodaka bertemu dengan seorang gadis yang memiliki kekuatan ajaib. Gadis dengan kekuatan ajaib tersebut bernama Hina. Apa yang dilakukan oleh gadis tersebut sangat luar biasa. Gadis itu hanya perlu berdoa untuk membuat cuaca menjadi lebih baik dan cerah. Akan tetapi, cuaca entah mengapa semakin tak keruan dan hidup mereka dirusak oleh takdir. Mereka harus segera memilih cara hidup mereka.',
                'category_id' => 1,
                'total_stock' => 10,
                'available_stock' => 10
            ],
            [
                'title' => 'Girls In The Dark',
                'author' => 'Akiyoshi Rikako',
                'publisher' => 'Haru',
                'published_date' => '2019-02-20',
                'isbn' => '9786025297281',
                'description' => 'Novel yang berjudul Girls In The Dark karya Rikako Akiyoshi ini menceritakan tentang kisah sekumpulan gadis remaja yang mencoba mengungkap kematian Shiraishi Itsumi, pemimpin klub sastra di sekolah mereka. Shiraishi Itsumi merupakan gadis yang terkenal dan diidolakan oleh siswa-siswa di sekolahnya. Kelompok remaja tersebut merupakan perwakilan dari klub sastra, yaitu Mirei Futanari, Akane Konan, Diana Dechewa, Sonoko Koga, Shiyo Takaoka dan Sayuri Sumikawa. Buku ini cocok dibaca untuk kalian yang suka novel dengan genre misteri.',
                'category_id' => 1,
                'total_stock' => 10,
                'available_stock' => 10
            ],
        ];

        foreach ($books as $data) {
            $stockTotal = $data['total_stock'];
            $stockAvailable = $data['available_stock'];
            unset($data['total_stock'], $data['available_stock']);

            $book = Book::create($data);

            Stock::create([
                'book_id' => $book->id,
                'total_stock' => $stockTotal,
                'available_stock' => $stockAvailable,
                'status' => 'available',
            ]);
        }
    }
}

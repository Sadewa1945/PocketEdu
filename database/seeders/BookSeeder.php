<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Genre;
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
                'data' => [
                    'title' => 'Alternate',
                    'authors_id' => 1,
                    'publisher' => 'Haru',
                    'published_date' => '2023-06-05',
                    'book_price' => 145000,
                    'isbn' => '9786235467115',
                    'description' => 'Alternate adalah sebuah aplikasi khusus untuk murid SMA yang akan menghubungkan murid-murid SMA se-Jepang.
                                    Berlatar SMA Kolese Enmei, Tokyo, hidup tiga orang murid SMA akan saling berpapasan.
                                    Iruru, ketua klub memasak SMA Kolese Enmei, memiliki trauma yang membuatnya sukar berkomunikasi dengan orang lain, tetapi ingin membuktikan diri lewat kompetisi memasak.
                                    Nazu membenci hubungan dalam keluarganya, karena itu, ia begitu percaya pada data dan bertekad menemukan pasangan paling serasi yang telah disaring dan dibuktikan dengan kecanggihan Alternate.
                                    Sementara itu, Naoshi yang berhenti sekolah, nekat jauh-jauh pergi ke Tokyo dari Osaka untuk menemui teman band masa kecilnya.',
                    'bookshelf_id' => 1,
                    'stock' => 10,
                ],
                'genres' => ['slice of life', 'Romance']
            ],
            [
                'data' => [
                    'title' => 'Your Name',
                    'authors_id' => 2,
                    'publisher' => 'Haru',
                    'published_date' => '2020-02-20',
                    'book_price' => 98100,
                    'isbn' => '9786237351207',
                    'description' => 'Mitsuha, seorang gadis SMA yang tinggal di sebuah desa di pegunungan, bermimpi dia menjadi seorang anak laki-laki. Dia bangun di sebuah kamar yang asing, berteman dengan orang asing, melihat kota Tokyo tepat di depan matanya. Di lain pihak, Taki, seorang pemuda SMA yang tinggal di Tokyo, juga bermimpi dirinya menjadi seorang gadis SMA yang tinggal di sebuah desa yang dikelilingi pegunungan. Akhirnya, keduanya pun sadar bahwa mereka bertukar tubuh dalam mimpi masing-masing. Takdir yang mempertemukan mereka itu mulai menggerakkan roda-roda nasib.',
                    'bookshelf_id' => 1,
                    'stock' => 5,
                ],
                'genres' => ['Romance', 'Fantasy']
            ],
            [
                'data' => [
                    'title' => 'Everything Becomes F: The Perfect Insider',
                    'authors_id' => 3,
                    'publisher' => 'Haru',
                    'published_date' => '2025-07-27',
                    'book_price' => 135900,
                    'isbn' => '9786235467351',
                    'description' => 'Sejak kecil, Profesor Magata Shiki hidup terisolasi di ruangannya di sebuah pusat riset berteknologi tinggi. Namun, pada suatu malam, ruangan yang seharusnya selalu terkunci rapat bak penjara itu tiba-tiba terbuka. Dari dalamnya, sebuah mayat bergaun pengantin muncul, menggelinding di atas robot-dengan tangan dan kaki yang termutilasi. Kebetulan, Saikawa Sohei-seorang dosen jurusan arsitektur-dan Nishinosono Moe, mahasiswinya, sedang mengunjungi pulau tersebut. Kini, mereka berdua harus memecahkan misteri pembunuhan ruang tertutup yang tampak mustahil ini.',
                    'bookshelf_id' => 1,
                    'stock' => 10,
                ],
                'genres' => ['Mystery', 'Thriller']
            ],
            [
                'data' => [
                    'title' => 'Weathering With You',
                    'authors_id' => 2,
                    'publisher' => 'Haru',
                    'published_date' => '2021-02-22',
                    'book_price' => 98100,
                    'isbn' => '9786237351627',
                    'description' => 'Pada suatu hari di musim panas, Hodaka, seorang siswa SMA kelas satu berhasil kabur dari pulau tempat tinggalnya dan pergi ke Tokyo. Suatu saat, di tengah derasnya hujan yang berkepanjangan dan dalam hiruk pikuk kota tersebut, Hodaka bertemu dengan seorang gadis yang memiliki kekuatan ajaib. Gadis dengan kekuatan ajaib tersebut bernama Hina. Apa yang dilakukan oleh gadis tersebut sangat luar biasa. Gadis itu hanya perlu berdoa untuk membuat cuaca menjadi lebih baik dan cerah. Akan tetapi, cuaca entah mengapa semakin tak keruan dan hidup mereka dirusak oleh takdir. Mereka harus segera memilih cara hidup mereka.',
                    'bookshelf_id' => 1,
                    'stock' => 10,
                ],
                'genres' => ['Romance', 'Fantasy']
            ],
            [
                'data' => [
                    'title' => 'Girls In The Dark',
                    'authors_id' => 4,
                    'publisher' => 'Haru',
                    'published_date' => '2019-02-20',
                    'book_price' => 94500,
                    'isbn' => '9786025297281',
                    'description' => 'Novel yang berjudul Girls In The Dark karya Rikako Akiyoshi ini menceritakan tentang kisah sekumpulan gadis remaja yang mencoba mengungkap kematian Shiraishi Itsumi, pemimpin klub sastra di sekolah mereka. Shiraishi Itsumi merupakan gadis yang terkenal dan diidolakan oleh siswa-siswa di sekolahnya. Kelompok remaja tersebut merupakan perwakilan dari klub sastra, yaitu Mirei Futanari, Akane Konan, Diana Dechewa, Sonoko Koga, Shiyo Takaoka dan Sayuri Sumikawa. Buku ini cocok dibaca untuk kalian yang suka novel dengan genre misteri.',
                    'bookshelf_id' => 1,
                    'stock' => 10,
                ],
                'genres' => ['Mystery', 'Thriller']
            ],
            [
                'data' => [
                    'title' => 'Sukarno: Biografi Lengkap Negarawan Sejati',
                    'authors_id' => 5,
                    'publisher' => 'C-Klik Media',
                    'published_date' => '2018-11-26',
                    'book_price' => 67500,
                    'isbn' => '9786025448942',
                    'description' => 'Untuk para warga negara Indonesia, mulai dari generasi muda hingga generasi veteran pasti sudah tidak asing lagi dengan Ir. Soekarno, Pahlawan Nasional Indonesia yang merupakan presiden pertama Republik Indonesia. Perjuangan dan jasanya untuk bangsa Indonesia tidak terhitung jumlah, bahkan kehebatannya tidak hanya terkenal di dalam negeri, namun terkenal sampai kancah internasional. Buku ini berisikan rangkuman perjalanan hidup dari sang presiden pertama Republik Indonesia, yang juga adalah pahlawan yang berperan penting dalam kemerdekaan Indonesia. Buku yang satu ini dapat menjadi salah satu media untuk kamu mengenal lebih jauh mengenai Ir. Soekarno. Buku-buku ini berisi kisah-kisah inspiratif yang menjadi jejak keteladanan dari sang presiden pertama NKRI yang dapat kamu simak, bahkan kamu jadikan teladan dalam kehidupan sehari-hari kamu. Dengan bahasa yang ringan dan mudah dipahami, tentunya tidak akan membuat kamu bosan membaca kisah perjalanan hidup Ir. Soekarno ini. Gaya bercerita yang dibumbui dengan dramatisasi, dapat membuat kamu terbawa suasana dan menyelam kehidupan dari presiden pertama Indonesia yang berliku-liku.',
                    'bookshelf_id' => 3,
                    'stock' => 6,
                ],
                'genres' => ['Biography']
            ],
            [
                'data' => [
                    'title' => 'Mohammad Hatta : Biografi Singkat 1902 - 1980',
                    'authors_id' => 6,
                    'publisher' => 'Garasi',
                    'published_date' => '2020-10-30',
                    'book_price' => 67500,
                    'isbn' => '9786237219637',
                    'description' => 'MOHAMMAD HATTA : BIOGRAFI SINGKAT 1902 - 1980',
                    'bookshelf_id' => 3,
                    'stock' => 8,
                ],
                'genres' => ['Biography']
            ],
            [
                'data' => [
                    'title' => 'Matematika Terapan',
                    'authors_id' => 7,
                    'publisher' => 'Penerbit Andi',
                    'published_date' => '2019-10-23',
                    'book_price' => 121500,
                    'isbn' => '9786230102325',
                    'description' => 'Manusia merupakan makhluk berakal yang menciptakan peradaban. Peradaban Manusia dapat berkembang dengan ilmu pengetahuan. Ilmu pengetahuan dikembangkan dengan sendirinya seiring dengan kompleksnya masalah yang dihadapi manusia dalam setiap tahap peradaban. Ilmu pengetahuan yang tak pernah terlepas dari tiap peradaban adalah matematika. Matematika diibaratkan alat bantu yang digunakan untuk berbagai persoalan.',
                    'bookshelf_id' => 2,
                    'stock' => 8,
                ],
                'genres' => ['Education']
            ],
        ];
        
        foreach ($books as $item) {
            $book = Book::create($item['data']);
            
            $genreIds = Genre::whereIn('name', $item['genres'])->pluck('id');
            $book->genres()->attach($genreIds);
        }
    }
}

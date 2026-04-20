<?php

namespace App\Filament\Resources\Returns;

use App\Filament\Resources\Returns\Pages\CreateReturn;
use App\Filament\Resources\Returns\Pages\EditReturn;
use App\Filament\Resources\Returns\Pages\ListReturns;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\ReturnBook;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;
use Carbon\Carbon;

class ReturnResource extends Resource
{
    protected static ?string $model = ReturnBook::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-book-open';
   
    protected static string|UnitEnum|null $navigationGroup = 'Transactions';

    protected static ?int $navigationSort = 2;

   public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            
            Select::make('borrowing_id')
                ->label('Select Borrowing (Book)')
                ->options(function () {
                    return Borrowing::with('borrowingsBook', 'borrowingsUser')
                        ->whereIn('status', ['borrowed', 'overdue'])
                        ->get()
                        ->mapWithKeys(function ($item) {
                            return [
                                $item->id => "{$item->borrowingsBook->title} - {$item->borrowingsUser->name}"
                            ];
                        });
                })
                ->searchable()
                ->required()
                ->live() 
                ->afterStateUpdated(function ($state, callable $set) {
                    if ($state) {
                        $borrowing = Borrowing::with('borrowingsUser')->find($state);
                        if ($borrowing) {
                            $set('borrower_name', $borrowing->borrowingsUser->name);
                            $set('quantity_returned', $borrowing->quantity);
                        }
                    } else {
                        $set('borrower_name', null);
                        $set('quantity_returned', 1);
                    }
                }),

            TextInput::make('borrower_name')
                ->label('Borrower Name')
                ->disabled() 
                ->required()
                ->dehydrated(false), 

            TextInput::make('quantity_returned')
                ->label('Quantity Returned')
                ->numeric()
                ->disabled()
                ->required()
                ->minValue(1)
                ->rules([
                    function (Get $get, ?\Illuminate\Database\Eloquent\Model $record) {
                        return function (string $attribute, $value, \Closure $fail) use ($get, $record) {
                            $borrowingId = $get('borrowing_id');
                            if (!$borrowingId) return;

                            $borrowing = Borrowing::find($borrowingId);
                            if (!$borrowing) return;

                            $alreadyReturned = ReturnBook::where('borrowing_id', $borrowingId)
                                ->whereIn('status', ['pending', 'accepted'])
                                ->when($record, fn($q) => $q->where('id', '!=', $record->id))
                                ->sum('quantity_returned');

                            if (($alreadyReturned + $value) > $borrowing->quantity) {
                                $sisa = $borrowing->quantity - $alreadyReturned;
                                $fail("Jumlah melebihi batas. Sisa buku yang belum kembali: {$sisa}.");
                            }
                        };
                    }
                ]),

            Select::make('return_condition')
                ->label('Return Condition')
                ->options([
                    'good' => 'Good / Normal',
                    'damaged' => 'Damaged',
                    'lost' => 'Lost'
                ])
                ->default('good')
                ->required(),
                
            Textarea::make('notes')->label('Notes'),
            Hidden::make('returned_at')->default(now()),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

            TextColumn::make('id')
                ->label('ID'),

            TextColumn::make('borrowing.borrowingsBook.title')
                ->label('Book')
                ->searchable()
                ->sortable(),

            TextColumn::make('borrowing.borrowingsUser.name')
                ->label('Borrower')
                ->searchable()
                ->sortable(),

            TextColumn::make('returned_at')
                ->label('Returned At')
                ->dateTime()
                ->sortable(),
            
            TextColumn::make('quantity_returned')
                ->label('Quantity Returned'),

            BadgeColumn::make('status')
                    ->label('Status')
                    ->formatStateUsing(fn (string $state): string => match ($state){
                        'pending' => 'Pending',
                        'accepted' => 'Accepted',
                        'rejected' => 'Rejected',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'accepted' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
        ])
            ->actions([
                ActionGroup::make([
                    
                   Action::make('changeStatus')
                    ->label('Change Status')
                    ->icon('heroicon-o-adjustments-horizontal')
                    ->color('success')
                    ->visible(fn ($record) => $record->status !== 'accepted')
                    ->form([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'accepted' => 'Accepted',
                                'rejected' => 'Rejected',
                            ])
                            ->required(),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'status' => $data['status'],
                        ]);

                        if ($data['status'] === 'accepted') {
                            $record->update(['returned_at' => now()]);
                            $record->borrowing->update(['status' => 'returned']);
                        } elseif ($data['status'] === 'rejected') {
                            $isOverdue = Carbon::now()->isAfter($record->borrowing->due_at);
                            $record->borrowing->update([
                                'status' => $isOverdue ? 'overdue' : 'borrowed'
                            ]);
                        }
                    }),

                    EditAction::make(),

                    DeleteAction::make()
                        ->modalHeading('Delete Return')
                        ->modalDescription('This action cannot be undone. Are you sure?'),
            
                ])
                ->label('More')
                ->icon('heroicon-o-ellipsis-vertical')
                ->color('gray'),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListReturns::route('/'),
            'create' => CreateReturn::route('/create'),
            'edit' => EditReturn::route('/{record}/edit'),
        ];
    }
}
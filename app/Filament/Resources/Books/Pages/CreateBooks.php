<?php

namespace App\Filament\Resources\Books\Pages;

use App\Filament\Resources\Books\BooksResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateBooks extends CreateRecord
{
    protected static string $resource = BooksResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create Book Data')
            ->modalDescription('Are you sure you want to create this book? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }

    protected function getFormActions(): array
    {
        return [
            parent::getCreateFormAction(),

            Action::make('createAndCopy')
                ->label('Create & Next Series Input')
                ->color('success')
                ->action(function () {
            
                    $data = $this->form->getState();

                    $this->create(another: true);

                    $data['published_date'] = null;
                    $data['isbn'] = null; 
                    $data['book_price'] = null;

                    $this->form->fill($data);
                }),

            parent::getCancelFormAction(),
        ];
    }
}

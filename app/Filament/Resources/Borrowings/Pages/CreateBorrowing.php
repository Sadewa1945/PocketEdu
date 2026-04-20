<?php

namespace App\Filament\Resources\Borrowings\Pages;

use App\Filament\Resources\Borrowings\BorrowingResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateBorrowing extends CreateRecord
{
    protected static string $resource = BorrowingResource::class;

    protected function getCreateFormAction(): Action
    {
        return Action::make('create')
            ->label(__('filament-panels::resources/pages/create-record.form.actions.create.label'))
            ->requiresConfirmation()
            ->modalHeading('Create Borrowing Data')
            ->modalDescription('Are you sure you want to create this borrowing? Make sure the data is correct.')
            ->modalSubmitActionLabel('Yes, Create')
            ->modalIcon('heroicon-o-check-circle')
            ->color('primary')
            ->action(fn () => $this->create());
    }
}

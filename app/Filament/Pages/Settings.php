<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;

class Settings extends Page implements HasForms
{
    use InteractsWithForms;

     protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    
    protected static ?string $title = 'Settings';
    protected string $view = 'filament.pages.settings';

    public ?array $data = [];

    public function mount(): void
    {
        $setting = Setting::first();
        
        $this->form->fill($setting?->toArray() ?? []);
    }

    public function form($form)
    {
        return $form
            ->schema([
                TextInput::make('app_name')
                    ->required()
                    ->label('App Name'),

                FileUpload::make('login_image')
                    ->image()
                    ->disk('public')
                    ->directory('settings')
                    ->label('Login Background')
                    ->preserveFilenames(),
            ])
            ->statePath('data');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan')
                ->action(function () {
                
                    $state = $this->form->getState();

                    Setting::updateOrCreate(
                        ['id' => 1],
                        $state
                    );

                    Notification::make()
                        ->title('Settings saved successfully')
                        ->success()
                        ->send();
                }),
        ];
    }
}
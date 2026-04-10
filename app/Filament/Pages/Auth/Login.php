<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Checkbox;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use DiogoGPinto\AuthUIEnhancer\Pages\Auth\Concerns\HasCustomLayout;

class Login extends BaseLogin
{
    use HasCustomLayout;
    protected function getCredentialsFromFormData(array $data): array
    {
        return [
            'email' => $data['email'],
            'password' => $data['password'],
        ];
    }

    protected function getRemember(): bool
    {
        return (bool) ($this->form->getState()['remember'] ?? false);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([

            TextInput::make('email')
                ->required()
                ->label('Email'),

            TextInput::make('password')
                ->password()
                ->required(),

            Checkbox::make('remember')
                ->label('Remember me'),
        ]);
    }
}

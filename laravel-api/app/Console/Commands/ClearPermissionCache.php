<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\PermissionRegistrar;

class ClearPermissionCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permission:cache-clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear the Spatie permission cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Clearing permission cache...');

        try {
            app(PermissionRegistrar::class)->forgetCachedPermissions();
            $this->info('Permission cache cleared successfully!');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to clear permission cache: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

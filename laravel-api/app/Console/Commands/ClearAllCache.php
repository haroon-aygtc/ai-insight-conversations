<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearAllCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all Laravel caches (cache, route, config, view, compiled)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to clear all caches...');

        // Clear application cache
        $this->call('cache:clear');
        $this->info('✓ Application cache cleared');

        // Clear route cache
        $this->call('route:clear');
        $this->info('✓ Route cache cleared');

        // Clear config cache
        $this->call('config:clear');
        $this->info('✓ Configuration cache cleared');

        // Clear compiled views
        $this->call('view:clear');
        $this->info('✓ Compiled views cleared');

        // Clear compiled class files
        $this->call('optimize:clear');
        $this->info('✓ Compiled class files cleared');

        // Clear permission cache (if using Spatie Permission)
        try {
            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            $this->info('✓ Permission cache cleared');
        } catch (\Exception $e) {
            $this->warn('! Permission cache clearing skipped: ' . $e->getMessage());
        }

        $this->newLine();
        $this->info('All caches have been successfully cleared!');

        return Command::SUCCESS;
    }
}

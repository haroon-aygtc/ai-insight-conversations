<?php

namespace Database\Seeders;

use App\Models\FormTemplate;
use Illuminate\Database\Seeder;

class FormTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pre-chat form templates
        FormTemplate::create([
            'name' => 'Basic Contact Information',
            'type' => 'pre_chat',
            'description' => 'Collects basic contact information before starting the chat',
            'is_default' => true,
            'fields' => [
                [
                    'id' => 'name',
                    'type' => 'text',
                    'label' => 'Name',
                    'placeholder' => 'Enter your name',
                    'required' => true,
                    'order' => 1,
                ],
                [
                    'id' => 'email',
                    'type' => 'email',
                    'label' => 'Email',
                    'placeholder' => 'Enter your email',
                    'required' => true,
                    'order' => 2,
                ],
                [
                    'id' => 'phone',
                    'type' => 'tel',
                    'label' => 'Phone Number',
                    'placeholder' => 'Enter your phone number',
                    'required' => false,
                    'order' => 3,
                ],
            ],
        ]);

        FormTemplate::create([
            'name' => 'Business Inquiry',
            'type' => 'pre_chat',
            'description' => 'Collects business-related information before starting the chat',
            'is_default' => false,
            'fields' => [
                [
                    'id' => 'name',
                    'type' => 'text',
                    'label' => 'Name',
                    'placeholder' => 'Enter your name',
                    'required' => true,
                    'order' => 1,
                ],
                [
                    'id' => 'email',
                    'type' => 'email',
                    'label' => 'Email',
                    'placeholder' => 'Enter your email',
                    'required' => true,
                    'order' => 2,
                ],
                [
                    'id' => 'company',
                    'type' => 'text',
                    'label' => 'Company',
                    'placeholder' => 'Enter your company name',
                    'required' => true,
                    'order' => 3,
                ],
                [
                    'id' => 'job_title',
                    'type' => 'text',
                    'label' => 'Job Title',
                    'placeholder' => 'Enter your job title',
                    'required' => false,
                    'order' => 4,
                ],
                [
                    'id' => 'inquiry_type',
                    'type' => 'select',
                    'label' => 'Inquiry Type',
                    'placeholder' => 'Select inquiry type',
                    'required' => true,
                    'order' => 5,
                    'options' => [
                        ['value' => 'sales', 'label' => 'Sales'],
                        ['value' => 'support', 'label' => 'Support'],
                        ['value' => 'partnership', 'label' => 'Partnership'],
                        ['value' => 'other', 'label' => 'Other'],
                    ],
                ],
            ],
        ]);

        // Post-chat form templates
        FormTemplate::create([
            'name' => 'Basic Feedback',
            'type' => 'post_chat',
            'description' => 'Collects basic feedback after the chat',
            'is_default' => true,
            'fields' => [
                [
                    'id' => 'satisfaction',
                    'type' => 'rating',
                    'label' => 'How satisfied were you with our service?',
                    'required' => true,
                    'order' => 1,
                    'min' => 1,
                    'max' => 5,
                ],
                [
                    'id' => 'feedback',
                    'type' => 'textarea',
                    'label' => 'Additional Feedback',
                    'placeholder' => 'Please share any additional feedback',
                    'required' => false,
                    'order' => 2,
                ],
            ],
        ]);

        FormTemplate::create([
            'name' => 'Detailed Feedback',
            'type' => 'post_chat',
            'description' => 'Collects detailed feedback after the chat',
            'is_default' => false,
            'fields' => [
                [
                    'id' => 'satisfaction',
                    'type' => 'rating',
                    'label' => 'How satisfied were you with our service?',
                    'required' => true,
                    'order' => 1,
                    'min' => 1,
                    'max' => 5,
                ],
                [
                    'id' => 'response_quality',
                    'type' => 'rating',
                    'label' => 'How would you rate the quality of responses?',
                    'required' => true,
                    'order' => 2,
                    'min' => 1,
                    'max' => 5,
                ],
                [
                    'id' => 'response_time',
                    'type' => 'rating',
                    'label' => 'How would you rate our response time?',
                    'required' => true,
                    'order' => 3,
                    'min' => 1,
                    'max' => 5,
                ],
                [
                    'id' => 'issue_resolved',
                    'type' => 'radio',
                    'label' => 'Was your issue resolved?',
                    'required' => true,
                    'order' => 4,
                    'options' => [
                        ['value' => 'yes', 'label' => 'Yes'],
                        ['value' => 'partially', 'label' => 'Partially'],
                        ['value' => 'no', 'label' => 'No'],
                    ],
                ],
                [
                    'id' => 'feedback',
                    'type' => 'textarea',
                    'label' => 'Additional Feedback',
                    'placeholder' => 'Please share any additional feedback',
                    'required' => false,
                    'order' => 5,
                ],
            ],
        ]);

        // Feedback form templates
        FormTemplate::create([
            'name' => 'Simple Rating',
            'type' => 'feedback',
            'description' => 'Simple rating feedback form',
            'is_default' => true,
            'fields' => [
                [
                    'id' => 'helpful',
                    'type' => 'rating',
                    'label' => 'Was this helpful?',
                    'required' => true,
                    'order' => 1,
                    'min' => 1,
                    'max' => 5,
                ],
            ],
        ]);

        FormTemplate::create([
            'name' => 'Thumbs Up/Down',
            'type' => 'feedback',
            'description' => 'Simple thumbs up/down feedback',
            'is_default' => false,
            'fields' => [
                [
                    'id' => 'helpful',
                    'type' => 'thumbs',
                    'label' => 'Was this helpful?',
                    'required' => true,
                    'order' => 1,
                ],
                [
                    'id' => 'comment',
                    'type' => 'textarea',
                    'label' => 'Comments',
                    'placeholder' => 'Any additional comments?',
                    'required' => false,
                    'order' => 2,
                    'conditional' => [
                        'field' => 'helpful',
                        'value' => 'down',
                    ],
                ],
            ],
        ]);
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWidgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled via middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'appearance_config' => 'nullable|array',
            'appearance_config.primaryColor' => 'nullable|string',
            'appearance_config.secondaryColor' => 'nullable|string',
            'appearance_config.borderRadius' => 'nullable|integer|min:0|max:50',
            'appearance_config.chatIconSize' => 'nullable|integer|min:20|max:80',
            'appearance_config.fontFamily' => 'nullable|string',
            'appearance_config.fontSize' => 'nullable|string',
            'appearance_config.fontWeight' => 'nullable|string',
            'appearance_config.textColor' => 'nullable|string',
            'appearance_config.headerTextColor' => 'nullable|string',
            'appearance_config.theme' => 'nullable|string|in:light,dark,auto',
            'appearance_config.iconStyle' => 'nullable|string',
            'appearance_config.customCSS' => 'nullable|string',

            'behavior_config' => 'nullable|array',
            'behavior_config.autoOpen' => 'nullable|string|in:yes,no,delayed',
            'behavior_config.delay' => 'nullable|integer|min:0',
            'behavior_config.position' => 'nullable|string|in:bottom-right,bottom-left,top-right,top-left',
            'behavior_config.animation' => 'nullable|string|in:fade,slide,bounce,none',
            'behavior_config.mobileBehavior' => 'nullable|string',
            'behavior_config.showAfterPageViews' => 'nullable|integer|min:0',
            'behavior_config.persistState' => 'nullable|boolean',
            'behavior_config.showNotifications' => 'nullable|boolean',

            'content_config' => 'nullable|array',
            'content_config.welcomeMessage' => 'nullable|string',
            'content_config.botName' => 'nullable|string|max:50',
            'content_config.inputPlaceholder' => 'nullable|string|max:100',
            'content_config.chatButtonText' => 'nullable|string|max:50',
            'content_config.headerTitle' => 'nullable|string|max:50',
            'content_config.enablePreChatForm' => 'nullable|boolean',
            'content_config.preChatFormFields' => 'nullable|array',
            'content_config.preChatFormTitle' => 'nullable|string|max:100',
            'content_config.preChatFormSubtitle' => 'nullable|string|max:200',
            'content_config.enableFeedback' => 'nullable|boolean',
            'content_config.feedbackPosition' => 'nullable|string',
            'content_config.feedbackOptions' => 'nullable|array',
            'content_config.showTypingIndicator' => 'nullable|boolean',
            'content_config.showAvatar' => 'nullable|boolean',

            'embedding_config' => 'nullable|array',
            'embedding_config.allowedDomains' => 'nullable|string',
            'embedding_config.enableAnalytics' => 'nullable|boolean',
            'embedding_config.gdprCompliance' => 'nullable|boolean',
        ];
    }
}

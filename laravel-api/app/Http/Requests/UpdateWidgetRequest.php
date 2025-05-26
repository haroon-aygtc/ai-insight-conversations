<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWidgetRequest extends FormRequest
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
            'name' => 'sometimes|string|max:100',
            'description' => 'sometimes|nullable|string|max:500',
            'appearance_config' => 'sometimes|array',
            'appearance_config.primaryColor' => 'sometimes|string',
            'appearance_config.secondaryColor' => 'sometimes|string',
            'appearance_config.borderRadius' => 'sometimes|integer|min:0|max:50',
            'appearance_config.chatIconSize' => 'sometimes|integer|min:20|max:80',
            'appearance_config.fontFamily' => 'sometimes|string',
            'appearance_config.fontSize' => 'sometimes|string',
            'appearance_config.fontWeight' => 'sometimes|string',
            'appearance_config.textColor' => 'sometimes|string',
            'appearance_config.headerTextColor' => 'sometimes|string',
            'appearance_config.theme' => 'sometimes|string|in:light,dark,auto',
            'appearance_config.iconStyle' => 'sometimes|string',
            'appearance_config.customCSS' => 'sometimes|string',

            'behavior_config' => 'sometimes|array',
            'behavior_config.autoOpen' => 'sometimes|string|in:yes,no,delayed',
            'behavior_config.delay' => 'sometimes|integer|min:0',
            'behavior_config.position' => 'sometimes|string|in:bottom-right,bottom-left,top-right,top-left',
            'behavior_config.animation' => 'sometimes|string|in:fade,slide,bounce,none',
            'behavior_config.mobileBehavior' => 'sometimes|string',
            'behavior_config.showAfterPageViews' => 'sometimes|integer|min:0',
            'behavior_config.persistState' => 'sometimes|boolean',
            'behavior_config.showNotifications' => 'sometimes|boolean',

            'content_config' => 'sometimes|array',
            'content_config.welcomeMessage' => 'sometimes|string',
            'content_config.botName' => 'sometimes|string|max:50',
            'content_config.inputPlaceholder' => 'sometimes|string|max:100',
            'content_config.chatButtonText' => 'sometimes|string|max:50',
            'content_config.headerTitle' => 'sometimes|string|max:50',
            'content_config.enablePreChatForm' => 'sometimes|boolean',
            'content_config.preChatFormFields' => 'sometimes|array|nullable',
            'content_config.preChatFormFields.*.id' => 'sometimes|string',
            'content_config.preChatFormFields.*.type' => 'sometimes|string',
            'content_config.preChatFormFields.*.label' => 'sometimes|string|nullable',
            'content_config.preChatFormFields.*.placeholder' => 'sometimes|string|nullable',
            'content_config.preChatFormFields.*.required' => 'sometimes|boolean',
            'content_config.preChatFormFields.*.options' => 'sometimes|array|nullable',
            'content_config.preChatFormTitle' => 'sometimes|string|max:100|nullable',
            'content_config.preChatFormSubtitle' => 'sometimes|string|max:200|nullable',
            
            'content_config.enablePostChatForm' => 'sometimes|boolean',
            'content_config.postChatFormFields' => 'sometimes|array|nullable',
            'content_config.postChatFormFields.*.id' => 'sometimes|string',
            'content_config.postChatFormFields.*.type' => 'sometimes|string',
            'content_config.postChatFormFields.*.label' => 'sometimes|string|nullable',
            'content_config.postChatFormFields.*.placeholder' => 'sometimes|string|nullable',
            'content_config.postChatFormFields.*.required' => 'sometimes|boolean',
            'content_config.postChatFormFields.*.options' => 'sometimes|array|nullable',
            'content_config.postChatFormTitle' => 'sometimes|string|max:100|nullable',
            'content_config.postChatFormSubtitle' => 'sometimes|string|max:200|nullable',
            
            'content_config.enableFeedback' => 'sometimes|boolean',
            'content_config.feedbackPosition' => 'sometimes|string|nullable',
            'content_config.feedbackOptions' => 'sometimes|array|nullable',
            'content_config.feedbackOptions.*.id' => 'sometimes|string',
            'content_config.feedbackOptions.*.label' => 'sometimes|string|nullable',
            'content_config.feedbackOptions.*.value' => 'sometimes|string|nullable',
            'content_config.showTypingIndicator' => 'sometimes|boolean',
            'content_config.showAvatar' => 'sometimes|boolean',

            'embedding_config' => 'sometimes|array',
            'embedding_config.allowedDomains' => 'sometimes|string',
            'embedding_config.enableAnalytics' => 'sometimes|boolean',
            'embedding_config.gdprCompliance' => 'sometimes|boolean',

            'is_active' => 'sometimes|boolean',
        ];
    }
}

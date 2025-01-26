package space.httpjames.tauri_plugin_tts

import android.app.Activity
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.webkit.WebView
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import java.util.Locale
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@InvokeArg
internal class SpeakArgs {
    lateinit var text: String
    var language: String? = null
}

@TauriPlugin
class ExamplePlugin(private val activity: Activity) : Plugin(activity) {
    private var tts: TextToSpeech? = null
    private var isInitialized = false
    private val activeUtterances = ConcurrentHashMap<String, Invoke>()

    override fun load(webView: WebView) {
        initializeTTS()
    }

    private fun initializeTTS() {
        tts = TextToSpeech(activity) { status ->
            isInitialized = status == TextToSpeech.SUCCESS
            if (isInitialized) {
                tts?.setOnUtteranceProgressListener(createUtteranceListener())
                setDefaultLanguage()
            } else {
                triggerTtsError("Failed to initialize TTS")
            }
        }
    }

    private fun setDefaultLanguage() {
        val defaultLocale = Locale.getDefault()
        when (tts?.setLanguage(defaultLocale)) {
            TextToSpeech.LANG_MISSING_DATA,
            TextToSpeech.LANG_NOT_SUPPORTED -> triggerTtsError("Default language not supported")
            else -> triggerTtsInitialized()
        }
    }

    private fun createUtteranceListener() = object : UtteranceProgressListener() {
        override fun onStart(utteranceId: String?) = handleStart(utteranceId)
        override fun onDone(utteranceId: String?) = handleDone(utteranceId)
        
        @Deprecated("Deprecated in Android")
        override fun onError(utteranceId: String?) = handleError(utteranceId, TextToSpeech.ERROR)
        
        override fun onError(utteranceId: String?, errorCode: Int) = handleError(utteranceId, errorCode)
    }

    private fun handleStart(utteranceId: String?) {
        utteranceId?.let { id ->
            activity.runOnUiThread {
                JSObject().apply { 
                    put("status", "started")
                    put("utteranceId", id)
                }.also { trigger("ttsStatus", it) }
            }
        }
    }

    private fun handleDone(utteranceId: String?) {
        utteranceId?.let { id ->
            activity.runOnUiThread {
                activeUtterances.remove(id)?.resolve(JSObject().apply { put("success", true) })
            }
        }
    }

    private fun handleError(utteranceId: String?, errorCode: Int) {
        utteranceId?.let { id ->
            activity.runOnUiThread {
                activeUtterances.remove(id)?.reject("Speech failed (error $errorCode)")
            }
        }
    }

    @Command
    fun speak(invoke: Invoke) {
        if (!isInitialized) return invoke.reject("TTS not initialized")

        try {
            val args = invoke.parseArgs(SpeakArgs::class.java)
            args.language?.let { setLanguage(invoke, it) }

            val utteranceId = UUID.randomUUID().toString()
            activeUtterances[utteranceId] = invoke

            val result = tts?.speak(args.text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
            if (result == TextToSpeech.ERROR) {
                activeUtterances.remove(utteranceId)
                invoke.reject("Failed to queue speech")
            }
        } catch (e: Exception) {
            invoke.reject(e.message ?: "Unknown error")
        }
    }

private fun setLanguage(invoke: Invoke, lang: String) {
    try {
        val locale = Locale.forLanguageTag(lang)
        when (tts?.setLanguage(locale)) {
            TextToSpeech.LANG_MISSING_DATA,
            TextToSpeech.LANG_NOT_SUPPORTED -> {
                invoke.reject("Language not supported: $lang")
                throw Exception("Language not supported")
            }
        }
    } catch (e: Exception) {
        invoke.reject("Invalid language code: $lang")
        throw e
    }
}
    @Command
    fun stop(invoke: Invoke) {
        tts?.stop()
        activity.runOnUiThread {
            activeUtterances.values.forEach { it.reject("Speech stopped") }
            activeUtterances.clear()
        }
        invoke.resolve()
    }

    private fun triggerTtsInitialized() {
        trigger("ttsInitialized", JSObject().apply { put("initialized", true) })
    }

    private fun triggerTtsError(error: String) {
        trigger("ttsError", JSObject().apply { put("error", error) })
    }
}
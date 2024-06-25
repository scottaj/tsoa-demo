package com.example.tsoademoapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.lifecycleScope
import com.example.tsoademoapp.api.apis.SpellsApi
import com.example.tsoademoapp.api.infrastructure.ApiClient
import com.example.tsoademoapp.api.infrastructure.Serializer.moshi
import com.example.tsoademoapp.api.models.ErrorResponse
import com.example.tsoademoapp.api.models.Spell
import com.example.tsoademoapp.ui.theme.TSOADemoAppTheme
import com.squareup.moshi.JsonAdapter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

val jsonAdapter: JsonAdapter<ErrorResponse> = moshi.adapter(ErrorResponse::class.java)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val viewModel: SpellViewModel by viewModels()
        lifecycleScope.launch {
            try {
                val spells = viewModel.getAllSpells()
                setContent {
                    TSOADemoAppTheme {
                        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                            SpellList(
                                spells = spells,
                                Modifier
                                    .padding(innerPadding)
                                    .verticalScroll(rememberScrollState())
                            )
                        }
                    }
                }
            } catch (e: Exception) {
                setContent {
                    TSOADemoAppTheme {
                        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                            Text(text = "Failed to load data: ${e.message}", modifier = Modifier.padding(innerPadding))
                        }
                    }
                }
            }
        }
    }
}

class SpellViewModel() : ViewModel() {
    private val spellsAPI: SpellsApi

    init {
        val apiClient = ApiClient("http://192.168.10.51:3000")
        spellsAPI = apiClient.createService(SpellsApi::class.java)
    }

    suspend fun getAllSpells(): List<Spell> {
        return withContext(Dispatchers.IO) {
            val response = spellsAPI.getAllSpells()
            if (response.isSuccessful) {
                response.body() ?: emptyList()
            } else {
                val rawErrorResponse = response.errorBody()?.string() ?: "<NO RESPONSE BODY>"
                val errorResponse = jsonAdapter.fromJson(rawErrorResponse)
                throw RuntimeException(errorResponse?.message ?: "UNKNOWN ERROR")
            }
        }
    }
}

@Composable
fun SpellList(spells: List<Spell>, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        spells.forEach { spell ->
            SpellRow(spell)
        }
    }
}

@Composable
fun SpellRow(spell: Spell) {
    Text(
        text = spell.name
    )
    Text(
        text = "level ${spell.level} ${spell.school}"
    )
    Text(
        text = spell.description
    )
    HorizontalDivider(color = Color.Black, thickness = 1.dp)
}

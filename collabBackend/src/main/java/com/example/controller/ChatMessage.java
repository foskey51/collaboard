package com.example.controller;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;

@Getter
@Setter
@ToString
@NoArgsConstructor 
public class ChatMessage {
	@JsonProperty
    private String sender;
	
	@JsonProperty
    private String content;
	
	@JsonProperty
    private String type;  
	
	@Override
	public String toString() {
	    return "ChatMessage(sender=" + sender + ", content=" + content + ", type=" + type + ")";
	}
}

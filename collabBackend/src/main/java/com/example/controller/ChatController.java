package com.example.controller;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import payload.request.ChatMessage;

import java.security.Principal;
import java.security.PrivateKey;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ChatController {
	
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final SimpMessagingTemplate messagingTemplate;
	
    private final Map<String, Set<String>> roomUsers = new ConcurrentHashMap<>();

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage( @DestinationVariable("roomId") String roomId, @Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        logger.info("Received message in room {}: {}", roomId, message.toString());
        logger.info("Headers: {}", headerAccessor.getSessionId());
        String senderSSID = headerAccessor.getSessionId();
        if (roomUsers.containsKey(roomId)) {
            roomUsers.get(roomId).forEach(user -> {
                if (!user.equals(senderSSID)) {
                	logger.info("RoomID: {}, Session: {}",roomId,user);
                	try {
                    	messagingTemplate.convertAndSendToUser(user , "/queue/chat/"+roomId, message);
					} catch (MessagingException e) {
						System.err.println(e);
					}
                }
            });
        }
    }


    @MessageMapping("/join/{roomId}")
    public void joinRoom(@DestinationVariable("roomId") String roomId, SimpMessageHeaderAccessor headerAccessor) {
        String senderSSID = headerAccessor.getSessionId();
        // Add the user to the room's user list
        roomUsers.putIfAbsent(roomId, new HashSet<>());
        roomUsers.get(roomId).add(senderSSID);

        logger.info("User {} joined room {}", senderSSID, roomId);
    }

    

    @MessageMapping("/leave/{roomId}")
    public void leaveRoom(@DestinationVariable("roomId") String roomId, SimpMessageHeaderAccessor headerAccessor) {
        String userSSID = headerAccessor.getSessionId();
        if (roomUsers.containsKey(roomId)) {
            roomUsers.get(roomId).remove(userSSID);
            if (roomUsers.get(roomId).isEmpty()) {
                roomUsers.remove(roomId);
            }
        }
    }
}
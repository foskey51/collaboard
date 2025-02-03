package com.example.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import payload.request.LoginRequest;
import payload.request.SignupRequest;
import payload.response.MessageResponse;

@CrossOrigin(origins = "*",maxAge=3300)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@PostMapping("/signup")
	private ResponseEntity<?> Signup (@Valid @RequestBody SignupRequest signupRequest) {
		
		
		return ResponseEntity.ok(new MessageResponse("User registered successfully"));
		
	}
	
	@PostMapping("/login")
	private ResponseEntity<?> Login (@Valid @RequestBody LoginRequest loginRequest){
		
		return ResponseEntity.ok(new MessageResponse("Login successfully"));

	}

}

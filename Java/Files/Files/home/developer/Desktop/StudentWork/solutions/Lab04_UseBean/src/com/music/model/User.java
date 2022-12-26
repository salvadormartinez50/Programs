package com.music.model;

import java.io.Serializable;

public class User implements Serializable {	
	private String userName;
	private String ip;
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
}

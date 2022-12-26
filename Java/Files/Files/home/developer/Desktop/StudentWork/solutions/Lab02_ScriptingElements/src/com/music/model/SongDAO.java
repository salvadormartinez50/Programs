package com.music.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SongDAO {

	private static Map<Long, Song> music = new HashMap<>();

	public List<Song> findAllSongs() {
		System.out.println("Entre al metodo songDAO");
		List<Song> songs = new ArrayList<Song>(music.values());
		return songs;
	}

	public void addASong(String title, String artist) {
		long newId = Collections.max(music.keySet()) + 1;
		System.out.println("Entre al metodo songdao2");
		 
		BigDecimal importe = new BigDecimal("10.03");
		 Date fecha = null;
		music.put(newId, new Song(newId, title, artist, importe, fecha));
	}
	
	static {
	music.put(101L, new Song(101L,"Baby Love","The Supremes2", new BigDecimal("10.45789"), new Date()));
	music.put(102L, new Song(102L,"Pancho and Lefty","Townes Van Zandt",  null, new Date()));
	music.put(103L, new Song(103L,"Truth Hurts","Lizzo",  new BigDecimal("120.03"), new Date()));
	music.put(104L, new Song(104L,"Take It Easy","The Eagles",  new BigDecimal("140.0356"), new Date()));
	music.put(105L, new Song(105L,"Your're So Vain","Carly Simon",  new BigDecimal("150.037"), new Date()));
	
}
	
}

package com.music.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SongDAO {

	private static Map<Long, Song> music = new HashMap<>();

	public List<Song> findAllSongs() {
		List<Song> songs = new ArrayList<Song>(music.values());
		return songs;
	}

	public void addASong(String title, String artist) {
		long newId = Collections.max(music.keySet()) + 1;
		
		 music.put(newId, new Song(newId, title, artist));
	}
	
	static {
		music.put(101L, new Song(101L,"Baby Love","The Supremes"));
		music.put(102L, new Song(102L,"Pancho and Lefty","Townes Van Zandt"));
		music.put(103L, new Song(103L,"Truth Hurts","Lizzo"));
		music.put(104L, new Song(104L,"Take It Easy","The Eagles"));
		music.put(105L, new Song(105L,"Your're So Vain","Carly Simon"));
		
	}
}

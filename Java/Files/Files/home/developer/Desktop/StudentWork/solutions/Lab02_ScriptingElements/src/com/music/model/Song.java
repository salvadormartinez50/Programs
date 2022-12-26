package com.music.model;

import java.math.BigDecimal;
import java.util.Date;

public class Song {

	private long id;
	private String title;
	private String artist;
	private BigDecimal importe;
	private Date fecha;
	

	

	public Song(long id, String title, String artist, BigDecimal importe, Date fecha) {
		  this.id = id;
			this.title = title;
			this.artist = artist;
			this.importe = importe;
			this.fecha = fecha;
			System.out.println("Entre al metodo song");
			System.out.println("id" + id);
	}

	public long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getArtist() {
		return artist;
	}
	public BigDecimal getImporte() {
		return importe;
	}
	public Date getFecha() {
		return fecha;
	}

	@Override
	public String toString() {
		return "id=" + id + "\ttitle=" + title + "\tartist=" + artist + "\timporte=" + importe + "\tfeha=" + fecha +"\n";
	}

	
	
	

}

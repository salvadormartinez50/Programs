package com.music.controller;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.music.model.Song;
import com.music.model.SongDAO;

/**
 * Servlet implementation class SongServlet
 */
@WebServlet("/SongServlet")
public class SongServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("Entrando al método SongServlet doGet");
		ArrayList<Song> listReports = new ArrayList<Song>();

		List<Song> allSongs = new SongDAO().findAllSongs();
		HttpSession session = request.getSession();
		session.setAttribute("Songs", allSongs);
		request.getRequestDispatcher("/songs.jsp").forward(request, response);
		textCreator(allSongs);
	}

	public void textCreator(List<Song> allSongs) {
		try {
			File objectFile = new File("Archivo.txt");
			if (objectFile.createNewFile()) {
				System.out.println("I just got created the file with the name  " + objectFile.getName());
			} else {
				System.out.println(" the file already exist!");
			}
			System.out.println("allSongs.get(0).getImporte().floatValue()  " + allSongs.get(0).getImporte().floatValue());
			System.out.println("allSongs.get(0).getImporte().floatValue()  " + (allSongs.get(0).getImporte().floatValue()- allSongs.get(0).getImporte().intValue()));
			System.out.println("allSongs.get(0).getImporte().floatValue()  " + allSongs.get(0).getImporte().toString().substring((allSongs.get(0).getImporte().toString().indexOf(".") + 1)));
			System.out.println("llSongs.get(0).getFecha()  " + allSongs.get(0).getFecha());
			
			for (int i = 0; i < allSongs.size(); i++) {

				FileWriter fw = new FileWriter("Archivo.txt", true);
				
				fw.write(String.format("%010d",((int) allSongs.get(i).getId())));
				fw.write(String.format("%-45s", (allSongs.get(i).getArtist())));
				fw.write(allSongs.get(i).getTitle());
				if(!Objects.isNull(allSongs.get(i).getImporte())) {
				fw.write(String.format("%010d", (allSongs.get(i).getImporte().toBigInteger())));
				fw.write((String) String.format("%-3s",allSongs.get(i).getImporte().toString().substring((allSongs.get(i).getImporte().toString().indexOf(".") + 1))).replace(' ','0').subSequence(0, 3));
				}else {
					fw.write(String.format("%-13s", ("Sin dato")));
				}
				fw.write(allSongs.get(i).getFecha().toString());
				
				fw.write("\n");
				fw.close();
			}
		} catch (Exception e) {
			System.out.println("I just got an error in the create file!");
		} finally {

		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("SongServlet doPost");

	}

}

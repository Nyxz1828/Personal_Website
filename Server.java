import java.io.*;
import java.net.*;
import java.util.*;

public class Server {
    private static final int PORT = 5050;
    private static ServerSocket serverSocket;
    private static final Map<String, Socket> clients = new HashMap<>();

    public static void main(String[] args) {
        try {
            serverSocket = new ServerSocket(PORT);
            System.out.println("✅ Server started on port " + PORT);

            while (true) {
                Socket socket = serverSocket.accept();
                new Thread(new ClientHandler(socket)).start();
            }
        } catch (IOException e) {
            System.out.println("❌ Server Error: " + e.getMessage());
        }
    }

    // --- Handle each connected client ---
    private static class ClientHandler implements Runnable {
        private Socket socket;
        private String name;
        private BufferedReader br;
        private BufferedWriter bw;

        public ClientHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try {
                br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                bw = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

                // --- Ask for client name ---
                bw.write("Enter your name: ");
                bw.flush();
                name = br.readLine();
                synchronized (clients) {
                    clients.put(name, socket);
                }

                System.out.println("👤 " + name + " joined the chat.");
                broadcast("📢 " + name + " joined the chat.", null);
                sendOnlineUsers();

                String msg;
                while ((msg = br.readLine()) != null) {
                    // Private message format: @target message
                    if (msg.startsWith("@")) {
                        int spaceIdx = msg.indexOf(" ");
                        if (spaceIdx != -1) {
                            String target = msg.substring(1, spaceIdx);
                            String content = msg.substring(spaceIdx + 1);
                            privateMessage(name, target, content);
                        }
                    } else {
                        broadcast(name + ": " + msg, name);
                    }
                }
            } catch (IOException e) {
                System.out.println("❌ Connection error with " + name);
            } finally {
                disconnect();
            }
        }

        private void sendOnlineUsers() throws IOException {
            StringBuilder usersList = new StringBuilder("🟢 Online: ");
            synchronized (clients) {
                for (String user : clients.keySet()) {
                    usersList.append(user).append(" ");
                }
            }
            bw.write(usersList.toString() + "\n");
            bw.flush();
        }

        private void broadcast(String msg, String exclude) {
            synchronized (clients) {
                for (Map.Entry<String, Socket> entry : clients.entrySet()) {
                    if (entry.getKey().equals(exclude)) continue;
                    try {
                        BufferedWriter w = new BufferedWriter(
                                new OutputStreamWriter(entry.getValue().getOutputStream())
                        );
                        w.write(msg + "\n");
                        w.flush();
                    } catch (IOException e) {
                        System.out.println("❌ Broadcast error: " + e.getMessage());
                    }
                }
            }
        }

        private void privateMessage(String from, String to, String msg) {
            Socket targetSocket;
            synchronized (clients) {
                targetSocket = clients.get(to);
            }
            if (targetSocket != null) {
                try {
                    BufferedWriter w = new BufferedWriter(
                            new OutputStreamWriter(targetSocket.getOutputStream())
                    );
                    w.write("(Private) " + from + ": " + msg + "\n");
                    w.flush();
                } catch (IOException e) {
                    System.out.println("❌ Private message error: " + e.getMessage());
                }
            } else {
                try {
                    bw.write("❌ User not found: " + to + "\n");
                    bw.flush();
                } catch (IOException ignored) {}
            }
        }

        private void disconnect() {
            try {
                if (name != null) {
                    synchronized (clients) {
                        clients.remove(name);
                    }
                    broadcast("🚪 " + name + " left the chat.", null);
                }
                socket.close();
            } catch (IOException ignored) {}
        }
    }
}

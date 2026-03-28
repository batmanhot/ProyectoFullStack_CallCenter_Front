import { useNotifications } from "../context/NotificationContext";

function NotificationBar() {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2 rounded shadow text-white ${
            n.type === "success"
              ? "bg-green-500"
              : n.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationBar;

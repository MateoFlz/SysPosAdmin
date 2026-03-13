import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import {
  useUsers,
  useCreateUser,
  useToggleUserStatus,
  useDeleteUser,
} from "@/hooks/queries/use-users.ts";
import { Header } from "@/components/layout/Header.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { Pagination } from "@/components/ui/Pagination.tsx";
import { SearchInput } from "@/components/ui/SearchInput.tsx";
import { Modal } from "@/components/ui/Modal.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select } from "@/components/ui/Select.tsx";
import { formatDate } from "@/lib/utils.ts";
import type { CreatedUser } from "@/types/user.ts";

export function UsersPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  const { data, isLoading } = useUsers({
    pageNumber,
    pageSize: 10,
    search: search || undefined,
  });
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  function handleSearch(value: string) {
    setSearch(value);
    setPageNumber(1);
  }

  return (
    <>
      <Header title="Usuarios">
        <Button size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Crear usuario
        </Button>
      </Header>

      <div className="p-6 space-y-4">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre o email..."
          className="max-w-sm"
        />

        <Card className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Nombre</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Empresa</th>
                      <th className="p-4 font-medium">Rol</th>
                      <th className="p-4 font-medium">Estado</th>
                      <th className="p-4 font-medium">Creado</th>
                      <th className="p-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          {user.companyName ?? "—"}
                        </td>
                        <td className="p-4">
                          <Badge variant="muted">{user.role}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={user.isActive ? "success" : "danger"}
                          >
                            {user.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant={user.isActive ? "outline" : "primary"}
                              size="sm"
                              onClick={() => toggleStatus.mutate(user.id)}
                              disabled={toggleStatus.isPending}
                            >
                              {user.isActive ? "Desactivar" : "Activar"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`,
                                  )
                                ) {
                                  deleteUser.mutate(user.id);
                                }
                              }}
                              disabled={deleteUser.isPending}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {data?.data.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No se encontraron usuarios
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data && (
                <Pagination meta={data.meta} onPageChange={setPageNumber} />
              )}
            </>
          )}
        </Card>
      </div>

      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(user) => {
          setShowCreateModal(false);
          setCreatedUser(user);
        }}
      />

      <Modal
        open={!!createdUser}
        onClose={() => setCreatedUser(null)}
        title="Usuario creado"
      >
        {createdUser && (
          <div className="space-y-3">
            <p className="text-sm">
              El usuario <strong>{createdUser.name}</strong> ha sido creado
              exitosamente.
            </p>
            <div className="rounded-md bg-muted p-3 space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{" "}
                {createdUser.email}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">
                  Contraseña temporal:
                </span>{" "}
                <code className="rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-800 font-mono">
                  {createdUser.temporaryPassword}
                </code>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Guarde esta contraseña. El usuario deberá cambiarla en su primer
              inicio de sesión.
            </p>
            <Button
              className="w-full"
              onClick={() => setCreatedUser(null)}
            >
              Cerrar
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}

function CreateUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (user: CreatedUser) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"Admin" | "Cashier">("Admin");
  const [tenantId, setTenantId] = useState("");
  const createUser = useCreateUser();

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setRole("Admin");
    setTenantId("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await createUser.mutateAsync({
      name,
      email,
      phone,
      role,
      tenantId,
    });
    resetForm();
    onCreated(result);
  }

  return (
    <Modal open={open} onClose={onClose} title="Crear usuario">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Juan Pérez"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="juan@empresa.com"
          required
        />
        <Input
          label="Teléfono"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+573001234567"
          required
        />
        <Select
          label="Rol"
          value={role}
          onChange={(event) =>
            setRole(event.target.value as "Admin" | "Cashier")
          }
          options={[
            { value: "Admin", label: "Administrador" },
            { value: "Cashier", label: "Cajero" },
          ]}
        />
        <Input
          label="Tenant ID"
          value={tenantId}
          onChange={(event) => setTenantId(event.target.value)}
          placeholder="UUID del tenant"
          required
        />

        {createUser.isError && (
          <p className="text-sm text-destructive">
            Error al crear el usuario. Verifique los datos.
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              "Crear"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

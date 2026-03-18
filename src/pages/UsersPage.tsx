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
import { Drawer } from "@/components/ui/Drawer.tsx";
import { Modal } from "@/components/ui/Modal.tsx";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select } from "@/components/ui/Select.tsx";
import { formatDate } from "@/lib/utils.ts";
import type { CreatedUser } from "@/types/user.ts";

export function UsersPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <>
      <Header title="Usuarios">
        <Button size="sm" onClick={() => setShowCreateDrawer(true)}>
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
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Nombre</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium hidden md:table-cell">
                        Empresa
                      </th>
                      <th className="p-4 font-medium">Rol</th>
                      <th className="p-4 font-medium">Estado</th>
                      <th className="p-4 font-medium hidden md:table-cell">
                        Creado
                      </th>
                      <th className="p-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4 hidden md:table-cell">
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
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
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
                              onClick={() =>
                                setDeleteTarget({
                                  id: user.id,
                                  name: user.name,
                                })
                              }
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

      {/* Create user drawer */}
      <CreateUserDrawer
        open={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        onCreated={(user) => {
          setShowCreateDrawer(false);
          setCreatedUser(user);
        }}
      />

      {/* Created user credentials modal */}
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

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar usuario"
        message={
          <>
            ¿Estás seguro de eliminar a{" "}
            <strong>{deleteTarget?.name}</strong>? Esta acción no se puede
            deshacer.
          </>
        }
        confirmText="Eliminar"
        variant="destructive"
        loading={deleteUser.isPending}
      />
    </>
  );
}

function CreateUserDrawer({
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
    <Drawer
      open={open}
      onClose={onClose}
      title="Crear usuario"
      description="Complete los datos para crear un nuevo usuario en el sistema."
    >
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

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={createUser.isPending}
          >
            {createUser.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              "Crear usuario"
            )}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

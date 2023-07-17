import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getOrganizationById } from 'apiSdk/organizations';
import { Error } from 'components/error';
import { OrganizationInterface } from 'interfaces/organization';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { deleteCoachById, createCoach } from 'apiSdk/coaches';
import { deleteGuestUserById, createGuestUser } from 'apiSdk/guest-users';
import { deletePlayerById, createPlayer } from 'apiSdk/players';
import { deleteSupportStaffById, createSupportStaff } from 'apiSdk/support-staffs';

function OrganizationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrganizationInterface>(
    () => (id ? `/organizations/${id}` : null),
    () =>
      getOrganizationById(id, {
        relations: ['user', 'coach', 'guest_user', 'player', 'support_staff'],
      }),
  );

  const [coachUserId, setCoachUserId] = useState(null);
  const coachHandleCreate = async () => {
    setCreateError(null);
    try {
      await createCoach({ organization_id: id, user_id: coachUserId });
      setCoachUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const coachHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCoachById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [guest_userUserId, setGuest_userUserId] = useState(null);
  const guest_userHandleCreate = async () => {
    setCreateError(null);
    try {
      await createGuestUser({ organization_id: id, user_id: guest_userUserId });
      setGuest_userUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const guest_userHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteGuestUserById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [playerUserId, setPlayerUserId] = useState(null);
  const playerHandleCreate = async () => {
    setCreateError(null);
    try {
      await createPlayer({ organization_id: id, user_id: playerUserId });
      setPlayerUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const playerHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [support_staffUserId, setSupport_staffUserId] = useState(null);
  const support_staffHandleCreate = async () => {
    setCreateError(null);
    try {
      await createSupportStaff({ organization_id: id, user_id: support_staffUserId });
      setSupport_staffUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const support_staffHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSupportStaffById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Organization Detail View
          </Text>
          {hasAccess('organization', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/organizations/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Description:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Image:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.image}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
            </Box>
            <Box>
              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Coaches:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'coach_user'} value={coachUserId} handleChange={setCoachUserId} />
                  </Box>
                  <Button colorScheme="blue" mt="4" mr="4" onClick={coachHandleCreate} isDisabled={!coachUserId}>
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.coach?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  coachHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>

              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Guest Users:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'guest_user_user'} value={guest_userUserId} handleChange={setGuest_userUserId} />
                  </Box>
                  <Button
                    colorScheme="blue"
                    mt="4"
                    mr="4"
                    onClick={guest_userHandleCreate}
                    isDisabled={!guest_userUserId}
                  >
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.guest_user?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  guest_userHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>

              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Players:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'player_user'} value={playerUserId} handleChange={setPlayerUserId} />
                  </Box>
                  <Button colorScheme="blue" mt="4" mr="4" onClick={playerHandleCreate} isDisabled={!playerUserId}>
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.player?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playerHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>

              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Support Staffs:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect
                      name={'support_staff_user'}
                      value={support_staffUserId}
                      handleChange={setSupport_staffUserId}
                    />
                  </Box>
                  <Button
                    colorScheme="blue"
                    mt="4"
                    mr="4"
                    onClick={support_staffHandleCreate}
                    isDisabled={!support_staffUserId}
                  >
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.support_staff?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  support_staffHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'organization',
    operation: AccessOperationEnum.READ,
  }),
)(OrganizationViewPage);

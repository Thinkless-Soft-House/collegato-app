import React, { useState } from 'react';
import { View, Linking } from 'react-native';
import { Button, Avatar, MD2Colors, Divider, List } from 'react-native-paper';
import openMap from 'react-native-open-maps';

import styles from './styles';
import { Reserva } from '../../models/reserva';
import { adicionarMascara } from '../../helpers/formHelpers';
import { PermissaoEnum } from '../../models/enums/permissaoEnum';
import { getLabelStatusReservaEnum } from '../../models/enums/statusReservaEnum';
import { getDataFormatadaParaCompromisso } from '../../helpers/dataHelpers';
import { gerarHeightPorcentagem } from '../../helpers/styleHelpers';

interface CompromissoItem {
  nomeCliente: string;
  enderecoCliente: string;
  telefoneCliente: string;
  emailCliente: string;
  nomeEmpresa: string;
  enderecoEmpresa: string;
  telefoneEmpresa: string;
  emailsResponsaveis: string;
  horaCompromisso: string;
}

interface CompromiseCardProps {
  item: Reserva;
  permissaoId: number;
  onPressAcompanhar: (item: Reserva) => void;
  onPressCancelarOuAtualizar: (id: number) => void;
}

export const CompromiseCard: React.FC<CompromiseCardProps> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);

  function onPressCancelarOuAtualizar(id: number) {
    props.onPressCancelarOuAtualizar(id);
  }

  function onPressAcompanhar(item: Reserva) {
    props.onPressAcompanhar(item);
  }

  function showDocument(documento: string) {
    if (!documento) {
      return '-';
    }

    if (documento.length == 11) {
      return adicionarMascara(documento, 'cpf');
    }

    return adicionarMascara(documento, 'cnpj');
  }

  function getFoto(reserva: Reserva, quemAgendou: boolean) {
    if (
      props.permissaoId == PermissaoEnum.Administrador ||
      props.permissaoId == PermissaoEnum.Cliente
    )
      return reserva.empresa.logo;

    return reserva.pessoa.foto;
  }

  function showNomeItem(reserva: Reserva): string {
    let nomeCliente = reserva.pessoa.nome;
    let nomeEmpresa = reserva.empresa.nome;

    switch (props.permissaoId) {
      case PermissaoEnum.Cliente:
        return nomeEmpresa;
      default:
        return nomeCliente;
    }
  }

  function onPressTelefone(telefone: string): void {
    Linking.openURL(`tel:${telefone}`);
  }

  function onPressEndereco(endereco: string): void {
    openMap({ query: endereco });
  }

  function showItem(reserva: Reserva) {
    let _empresa = reserva.empresa;
    let empresaEndereco = `${_empresa.endereco} - ${_empresa.numeroEndereco} - ${_empresa.municipio} - ${_empresa.estado} - ${_empresa.cep} - ${_empresa.pais}`;

    let _pessoa = reserva.pessoa;
    let pessoaEndereco = `${_pessoa.endereco} - ${_pessoa.numero} - ${_pessoa.municipio} - ${_pessoa.estado} - ${_pessoa.cep} - ${_pessoa.pais}`;

    let reservaItem: CompromissoItem = {} as CompromissoItem;
    reservaItem.nomeCliente = _pessoa.nome;
    reservaItem.emailCliente = reserva.usuario.login;
    reservaItem.enderecoCliente = pessoaEndereco;
    reservaItem.telefoneCliente = adicionarMascara(
      _pessoa.telefone,
      'cel-phone'
    );

    reservaItem.nomeEmpresa = _empresa.nome;
    // let emailsResponsaveis = "";
    // reserva.sala.responsavel.forEach((resp, index) => {
    //     if (index == 0) {
    //         emailsResponsaveis += resp.usuario.login;
    //     }
    //     else {
    //         emailsResponsaveis += ` - ${resp.usuario.login}`;
    //     }
    // });
    // reservaItem.emailsResponsaveis = emailsResponsaveis;
    reservaItem.telefoneEmpresa = _empresa.telefone;
    reservaItem.enderecoEmpresa = empresaEndereco;

    switch (props.permissaoId) {
      case PermissaoEnum.Administrador:
        return (
          <>
            <List.Item
              title={reservaItem.nomeCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='Cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='account-tie'
                />
              )}
            />
            <List.Item
              title={reservaItem.emailCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='E-mail do cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='email-check'
                />
              )}
            />
            <List.Item
              title={reservaItem.telefoneCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              onPress={() => onPressTelefone(reservaItem.telefoneCliente)}
              description='Telefone do cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='cellphone-check'
                />
              )}
            />
            <List.Item
              title={reservaItem.enderecoCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='Endereço do cliente'
              onPress={() => onPressEndereco(reservaItem.enderecoCliente)}
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='map-marker-multiple'
                />
              )}
            />
            <List.Item
              title={reservaItem.nomeEmpresa}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='Empresa'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='account-tie'
                />
              )}
            />
            <List.Item
              title={reservaItem.telefoneEmpresa}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              onPress={() => onPressTelefone(reservaItem.telefoneEmpresa)}
              description='Telefone da empresa'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='cellphone-check'
                />
              )}
            />
            <List.Item
              title={reservaItem.enderecoEmpresa}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              onPress={() => onPressEndereco(reservaItem.enderecoEmpresa)}
              description='Endereço da empresa'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='map-marker-multiple'
                />
              )}
            />
          </>
        );
      case PermissaoEnum.Cliente:
        return (
          <>
            <List.Item
              title={reservaItem.nomeEmpresa}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='Empresa'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='account-tie'
                />
              )}
            />
            <List.Item
              title={reservaItem.enderecoEmpresa}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              onPress={() => onPressEndereco(reservaItem.enderecoEmpresa)}
              description='Endereço da empresa'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='map-marker-multiple'
                />
              )}
            />
            <List.Item
              title={reservaItem.telefoneEmpresa}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              onPress={() => onPressTelefone(reservaItem.telefoneEmpresa)}
              description='Telefone da empresa'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='cellphone-check'
                />
              )}
            />
          </>
        );
      default:
        return (
          <>
            <List.Item
              title={reservaItem.nomeCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='Cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='account-tie'
                />
              )}
            />
            <List.Item
              title={reservaItem.emailCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='E-mail do cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='email-check'
                />
              )}
            />
            <List.Item
              title={reservaItem.telefoneCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              onPress={() => onPressTelefone(reservaItem.telefoneCliente)}
              description='Telefone do cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='cellphone-check'
                />
              )}
            />
            <List.Item
              title={reservaItem.enderecoCliente}
              titleNumberOfLines={4}
              descriptionNumberOfLines={4}
              description='Endereço do cliente'
              left={(_props) => (
                <List.Icon
                  {..._props}
                  style={{ width: 25 }}
                  icon='map-marker-multiple'
                />
              )}
            />
          </>
        );
    }
  }

  return (
    <>
      <List.Accordion
        style={[
          { marginVertical: 10, backgroundColor: '#FFF', borderRadius: 5 },
          styles.shadow,
        ]}
        titleStyle={{ margin: 0, flexWrap: 'wrap' }}
        descriptionStyle={{ margin: 0 }}
        titleNumberOfLines={5}
        title={`Seu compromisso com: ${showNomeItem(props.item)}`}
        description={getLabelStatusReservaEnum(props.item.statusId)}
        descriptionNumberOfLines={2}
        left={(_props) => (
          <Avatar.Image
            size={60}
            source={{
              uri: `data:image/jpeg;base64,${getFoto(props.item, false)}`,
            }}
          />
        )}
      >
        <List.Item
          title={getLabelStatusReservaEnum(props.item.statusId)}
          description='Status'
          left={(_props) => (
            <List.Icon {..._props} style={{ width: 25 }} icon='brightness-1' />
          )}
        />
        <List.Item
          title={getDataFormatadaParaCompromisso(props.item.date)}
          description='Data do compromisso'
          left={(_props) => (
            <List.Icon
              {..._props}
              style={{ width: 25 }}
              icon='calendar-multiple-check'
            />
          )}
        />
        <List.Item
          title={`${props.item.horaInicio} - ${props.item.horaFim}`}
          description='Hora do compromisso'
          left={(_props) => (
            <List.Icon {..._props} style={{ width: 25 }} icon='clock-check' />
          )}
        />
        {showItem(props.item)}
        <Divider />

        <View style={[{}, styles.cardActionContainer]}>
          <Button
            style={styles.cardActionStatusButton}
            mode='contained'
            onPress={() => onPressAcompanhar(props.item)}
          >
            Acompanhar
          </Button>

          {props.permissaoId != PermissaoEnum.Cliente ? (
            <Button
              style={styles.cardActionStatusButton}
              mode='contained'
              buttonColor={MD2Colors.green400}
              onPress={() => onPressCancelarOuAtualizar(props.item.id)}
            >
              Atualizar
            </Button>
          ) : (
            <Button
              mode='text'
              textColor={MD2Colors.red400}
              onPress={() => onPressCancelarOuAtualizar(props.item.id)}
            >
              Cancelar
            </Button>
          )}
        </View>
      </List.Accordion>

      {/* <Card
                mainContentStyle={{ marginBottom: 15 }}
                title='Seu compromisso com:'
                titleStyle={{ margin: 0, flexWrap: 'wrap' }}
                subtitle={`Sala - ${props.item.salaNome}`}
                subtitleStyle={{ margin: 0 }}
                contentStyle={styles.cardContentStyle}
                leftStyle={styles.cardLeftStyle}
                rightStyle={styles.cardRightStyle}
                right={<Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64,${getFoto(props.item, false)}` }} />}
            >
                <>
                    <Divider />
                    <View>
                        <List.Item
                            title={getLabelStatusReservaEnum(props.item.statusId)}
                            description="Status"
                            left={_props => <List.Icon {..._props} style={{ width: 25 }} icon="brightness-1" />}
                        />
                        <List.Item
                            title={getDataFormatadaParaCompromisso(props.item.date)}
                            description="Data do compromisso"
                            left={_props => <List.Icon {..._props} style={{ width: 25 }} icon="calendar-multiple-check" />}
                        />
                        <List.Item
                            title={`${props.item.horaInicio} - ${props.item.horaFim}`}
                            description="Hora do compromisso"
                            left={_props => <List.Icon {..._props} style={{ width: 25 }} icon="clock-check" />}
                        />
                        {showItem(props.item)}
                    </View>
                    <View style={styles.cardActionContainer}>
                        <Button style={styles.cardActionStatusButton} mode="contained" onPress={() => onPressAcompanhar(props.item)}>
                            Acompanhar
                        </Button>

                        {props.permissaoId != PermissaoEnum.Cliente ?
                            (<Button
                                style={styles.cardActionStatusButton}
                                mode="contained"
                                color={MD2Colors.green400}
                                onPress={() => onPressCancelarOuAtualizar(props.item.id)}
                            >
                                Atualizar
                            </Button>)
                            :
                            (<Button
                                mode="text"
                                color={MD2Colors.red400}
                                onPress={() => onPressCancelarOuAtualizar(props.item.id)}>
                                Cancelar
                            </Button>)
                        }
                    </View>
                </>
            </Card> */}
    </>
  );
};
